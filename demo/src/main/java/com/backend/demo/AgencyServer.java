package com.backend.demo;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.*;

import java.util.*;
import java.util.stream.Collectors;

@SpringBootApplication
@RestController
@CrossOrigin(origins = "*")
public class AgencyServer {

    public static void main(String[] args) {
        SpringApplication.run(AgencyServer.class, args);
    }

    private final UserRepository userRepository;
    private final TourRepository tourRepository;
    private final OrderRepository orderRepository;

    public AgencyServer(UserRepository u, TourRepository t, OrderRepository o) {
        this.userRepository = u;
        this.tourRepository = t;
        this.orderRepository = o;
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    private User checkAuth(String token, String requiredRole) {
        if (token == null || token.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No token");
        }

        String[] parts = token.split("-");
        if (parts.length < 2) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token format");
        }

        Long userId;
        try {
            userId = Long.parseLong(parts[0]);
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token id");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token user"));

        if (requiredRole != null && !user.getRole().equals(requiredRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        
        return user;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        try {
            user.setRole("customer");
            user.setBalance(0.0);
            userRepository.save(user);
            return Map.of("message", "Registered successfully");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> creds) {
        String email = creds.get("email");
        String password = creds.get("password");

        User user = userRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));

        List<Order> orders = orderRepository.findByUser(user);
        List<Long> purchasedTourIds = orders.stream()
                .map(order -> order.getTour().getId())
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("token", user.getId() + "-" + user.getRole());
        response.put("roleName", user.getRole());
        response.put("purchasedTourIds", purchasedTourIds);
        
        response.put("name", user.getName());
        response.put("balance", user.getBalance());
        return response;
    }

    @GetMapping("/profile")
    public Map<String, Object> getProfile(@RequestHeader(value="Authorization", required=false) String token) {
        User user = checkAuth(token, null); 
        
        List<Order> orders = orderRepository.findByUser(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("orders", orders);
        
        return response;
    }

    @GetMapping("/tours")
    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    @PostMapping("/tours")
    public Tour createTour(@RequestHeader(value="Authorization", required=false) String token, 
                           @RequestBody Tour tour) {
        checkAuth(token, "agent");
        return tourRepository.save(tour);
    }

    @PutMapping("/tours/{id}")
    public Map<String, String> updateTour(@RequestHeader(value="Authorization", required=false) String token,
                                          @PathVariable Long id, @RequestBody Tour req) {
        checkAuth(token, "agent");
        Tour tour = tourRepository.findById(id).orElseThrow();
        if(req.getName() != null) tour.setName(req.getName());
        if(req.getDateStart() != null) tour.setDateStart(req.getDateStart());
        if(req.getDateEnd() != null) tour.setDateEnd(req.getDateEnd());
        if(req.getOrigin() != null) tour.setOrigin(req.getOrigin());
        if(req.getDestination() != null) tour.setDestination(req.getDestination());
        if(req.getTour_type() != null) tour.setTour_type(req.getTour_type());
        if(req.getIsHot() != null) tour.setIsHot(req.getIsHot());
        if(req.getPrice() != null) tour.setPrice(req.getPrice());
        if(req.getDiscountPrice() != null) tour.setDiscountPrice(req.getDiscountPrice());
        
        tourRepository.save(tour);
        return Map.of("message", "Updated");
    }

    @DeleteMapping("/tours/{id}")
    public Map<String, String> deleteTour(@RequestHeader(value="Authorization", required=false) String token,
                                          @PathVariable Long id) {
        checkAuth(token, "agent");
        tourRepository.deleteById(id);
        return Map.of("message", "Deleted");
    }

    @PostMapping("/balance")
    public Map<String, Object> updateBalance(@RequestHeader(value="Authorization", required=false) String token,
                                             @RequestBody Map<String, Object> body) {
        checkAuth(token, "agent");
        
        Long userId = Long.parseLong(body.get("userId").toString());
        Double amount = Double.parseDouble(body.get("amount").toString());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);

        return Map.of("message", "Balance updated", "balance", user.getBalance());
    }

    @GetMapping("/orders")
    public List<Order> getOrders(@RequestHeader(value="Authorization", required=false) String token) {
        checkAuth(token, "agent");
        return orderRepository.findAll();
    }

    @PostMapping("/buy")
    public Map<String, Object> buyTour(@RequestHeader(value="Authorization", required=false) String token,
                                       @RequestBody Map<String, Long> body) {
        User user = checkAuth(token, "customer");
        Long tourId = body.get("tourId");

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

        Double priceToPay = (tour.getDiscountPrice() != null && tour.getDiscountPrice() > 0) 
                            ? tour.getDiscountPrice() 
                            : tour.getPrice();
        if (user.getBalance() < priceToPay) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Не хватает средств");
        }

        user.setBalance(user.getBalance() - priceToPay);
        userRepository.save(user);
        Order order = new Order();
        order.setUser(user);
        order.setTour(tour);
        orderRepository.save(order);

        return Map.of(
            "message", "Tour purchased", 
            "tourId", tour.getId(),
            "newBalance", user.getBalance() 
        );
    }

    @GetMapping("/users")
    public List<User> getAllUsers(@RequestHeader(value="Authorization", required=false) String token) {
        checkAuth(token, "agent");
        return userRepository.findAll();
    }

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.count() == 0) {
                User agent = new User();
                agent.setEmail("agent@mail.com");
                agent.setPassword("admin");
                agent.setRole("agent");
                agent.setName("Дмитрий");
                agent.setSurname("Петров");
                agent.setBalance(0.0);
                userRepository.save(agent);

                User customer = new User();
                customer.setEmail("user@mail.com");
                customer.setPassword("123");
                customer.setRole("customer");
                customer.setName("Иван");
                customer.setSurname("Иванов");
                customer.setPatronymic("Иванович");
                customer.setPhone("+375299435586");
                customer.setBalance(50000.0);
                userRepository.save(customer);

                List<Tour> tours = new ArrayList<>();
                
                tours.add(new Tour("Египет Все Включено", "2026-03-01", "2026-03-10", "Минск", "Хургада", "Отдых", true, 45000.0, 39000.0));
                tours.add(new Tour("Шоппинг в Милане", "2026-04-10", "2026-04-15", "Минск", "Милан", "Шоппинг", false, 80000.0, null));
                tours.add(new Tour("Экскурсия по Парижу", "2026-05-01", "2026-05-07", "Минск", "Париж", "Экскурсия", false, 120000.0, 100000.0));
                tours.add(new Tour("Турция Анталья", "2026-06-15", "2026-06-25", "Минск", "Анталья", "Отдых", true, 60000.0, 55000.0));
                
                tourRepository.saveAll(tours);
                
                System.out.println("Users and Tours created. Server started on port 3000");
            }
        };
    }
}

@Entity
@Data
@NoArgsConstructor
class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String role;
    
    private String name;
    private String surname;
    private String patronymic;
    private String phone;
    
    private Double balance;

    @OneToMany(mappedBy = "user")
    @com.fasterxml.jackson.annotation.JsonIgnore 
    private List<Order> orders;
}

@Entity
@Data
@NoArgsConstructor
class Tour {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String dateStart;
    @Column(nullable = false)
    private String dateEnd;
    @Column(nullable = false)
    private String origin;
    @Column(nullable = false)
    private String destination;
    @Column(nullable = false)
    private String tour_type;
    
    private Boolean isHot;
    
    @Column(nullable = false)
    private Double price;
    
    private Double discountPrice;

    @OneToMany(mappedBy = "tour")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Order> orders;

    public Tour(String n, String ds, String de, String o, String d, String tt, Boolean h, Double p, Double dp) {
        this.name=n; this.dateStart=ds; this.dateEnd=de; this.origin=o; 
        this.destination=d; this.tour_type=tt; this.isHot=h; this.price=p; this.discountPrice=dp;
    }
}

@Entity
@Data
@NoArgsConstructor
@Table(name = "orders")
class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "tour_id")
    private Tour tour;
    @Column(name = "created_at")
    private String createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = java.time.LocalDateTime.now().toString();
    }
}

interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndPassword(String email, String password);
}

interface TourRepository extends JpaRepository<Tour, Long> {}

interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}