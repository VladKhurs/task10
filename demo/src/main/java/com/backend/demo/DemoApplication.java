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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.*;

@SpringBootApplication
@RestController
// Разрешаем CORS для всех (аналог app.use(cors()))
@CrossOrigin(origins = "*") 
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    // --- НАСТРОЙКА CORS (чтобы точно работало с фронтом) ---
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(false); 
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    // Внедряем репозитории (доступ к таблицам)
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final CrewMemberRepository crewRepository;

    public DemoApplication(UserRepository u, FlightRepository f, CrewMemberRepository c) {
        this.userRepository = u;
        this.flightRepository = f;
        this.crewRepository = c;
    }

    // --- ФУНКЦИЯ AUTH (аналог middleware) ---
    private void checkAuth(String token, String requiredRole) {
        if (token == null || token.isEmpty()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No token");
        
        Long userId;
        try { userId = Long.parseLong(token); } 
        catch (NumberFormatException e) { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token"); }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token"));

        if (requiredRole != null && !user.getRole().equals(requiredRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
    }

    // --- ЭНДПОИНТЫ (Routes) ---

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> creds) {
        User user = userRepository.findByLoginAndPassword(creds.get("login"), creds.get("password"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid credentials"));
        // Возвращаем JSON { token: 1, roleName: "admin" }
        return Map.of("token", user.getId(), "roleName", user.getRole());
    }

    @GetMapping("/flights")
    public List<Flight> getFlights() {
        return flightRepository.findAll();
    }

    @PostMapping("/flights")
    public Flight createFlight(@RequestHeader(value="Authorization", required=false) String token, @RequestBody Flight flight) {
        checkAuth(token, "admin");
        return flightRepository.save(flight);
    }

    @PutMapping("/flights/{id}")
    public Map<String, Boolean> updateFlight(@RequestHeader(value="Authorization", required=false) String token, 
                                             @PathVariable Long id, @RequestBody Flight data) {
        checkAuth(token, "admin");
        Flight f = flightRepository.findById(id).orElseThrow();
        if(data.getFlightNumber() != null) f.setFlightNumber(data.getFlightNumber());
        if(data.getDeparturePlace() != null) f.setDeparturePlace(data.getDeparturePlace());
        if(data.getArrivalPlace() != null) f.setArrivalPlace(data.getArrivalPlace());
        if(data.getDepartureTime() != null) f.setDepartureTime(data.getDepartureTime());
        if(data.getArrivalTime() != null) f.setArrivalTime(data.getArrivalTime());
        flightRepository.save(f);
        return Map.of("success", true);
    }

    @DeleteMapping("/flights/{id}")
    public Map<String, Boolean> deleteFlight(@RequestHeader(value="Authorization", required=false) String token, @PathVariable Long id) {
        checkAuth(token, "admin");
        flightRepository.deleteById(id);
        return Map.of("success", true);
    }

    // DTO для создания члена экипажа (принимает flightId)
    @Data
    static class CrewRequest {
        private Long flightId;
        private String firstName;
        private String lastName;
        private String middleName;
        private String profession;
        private String phone;
    }

    @PostMapping("/crew")
    public CrewMember createCrew(@RequestHeader(value="Authorization", required=false) String token,
                                 @RequestBody CrewRequest req) {
        checkAuth(token, "dispatcher");
        Flight flight = flightRepository.findById(req.getFlightId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found"));
        
        CrewMember member = new CrewMember();
        member.setFirstName(req.getFirstName());
        member.setLastName(req.getLastName());
        member.setMiddleName(req.getMiddleName());
        member.setProfession(req.getProfession());
        member.setPhone(req.getPhone());
        member.setFlight(flight);
        
        return crewRepository.save(member);
    }

    @PutMapping("/crew/{id}")
    public Map<String, Boolean> updateCrew(@RequestHeader(value="Authorization", required=false) String token,
                                           @PathVariable Long id, @RequestBody CrewMember data) {
        checkAuth(token, "dispatcher");
        CrewMember c = crewRepository.findById(id).orElseThrow();
        if(data.getFirstName() != null) c.setFirstName(data.getFirstName());
        if(data.getLastName() != null) c.setLastName(data.getLastName());
        if(data.getMiddleName() != null) c.setMiddleName(data.getMiddleName());
        if(data.getProfession() != null) c.setProfession(data.getProfession());
        if(data.getPhone() != null) c.setPhone(data.getPhone());
        crewRepository.save(c);
        return Map.of("success", true);
    }

    @DeleteMapping("/crew/{id}")
    public Map<String, Boolean> deleteCrew(@RequestHeader(value="Authorization", required=false) String token, @PathVariable Long id) {
        checkAuth(token, "dispatcher");
        crewRepository.deleteById(id);
        return Map.of("success", true);
    }

    // --- ЗАПОЛНЕНИЕ БАЗЫ ДАННЫХ (аналог функции start()) ---
    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Создаем пользователей
            if (userRepository.count() == 0) {
                userRepository.save(new User("admin", "123", "admin"));
                userRepository.save(new User("disp", "123", "dispatcher"));
                System.out.println("Users created.");

                String[] pilots = {"Александр Глебов", "Дмитрий Ковалев", "Сергей Новик", "Игорь Гончаров", "Павел Жук", "Виктор Мороз", "Антон Волков", "Валерий Зайцев"};
                String[] navs = {"Олег Петров", "Максим Сидоров", "Евгений Кравец", "Роман Василевский"};
                String[] radios = {"Андрей Сокол", "Владимир Попов", "Денис Макаров", "Кирилл Белов"};
                String[] stews = {"Елена Иванова", "Мария Смирнова", "Ольга Кузнецова", "Татьяна Козлова", "Наталья Орлова", "Светлана Кравченко", "Анна Борисевич", "Юлия Савицкая"};

                createMockFlight("B2-975", "Москва", 1.5, 0, pilots, navs, radios, stews);
                createMockFlight("B2-717", "Дубай", 6.0, 1, pilots, navs, radios, stews);
                createMockFlight("B2-783", "Стамбул", 3.5, 2, pilots, navs, radios, stews);
                createMockFlight("B2-735", "Тбилиси", 3.0, 3, pilots, navs, radios, stews);
                
                System.out.println("Mock data populated.");
            }
        };
    }

    // Вспомогательная функция для заполнения рейса
    private void createMockFlight(String number, String dest, double hours, int index, 
                                  String[] pilots, String[] navs, String[] radios, String[] stews) {
        long now = System.currentTimeMillis();
        long departureMillis = now + (index * 2L * 3600 * 1000); // смещение +2 часа
        long arrivalMillis = departureMillis + (long)(hours * 3600 * 1000);

        Flight f = new Flight();
        f.setFlightNumber(number);
        f.setDeparturePlace("Минск");
        f.setArrivalPlace(dest);
        f.setDepartureTime(new Date(departureMillis));
        f.setArrivalTime(new Date(arrivalMillis));
        f = flightRepository.save(f);

        // Добавляем экипаж
        int pIdx = index * 2;
        saveCrew(f, pilots[pIdx % pilots.length], "Пилот");
        saveCrew(f, pilots[(pIdx + 1) % pilots.length], "Пилот");
        saveCrew(f, navs[index % navs.length], "Штурман");
        saveCrew(f, radios[index % radios.length], "Радист");
        
        int sIdx = index * 2;
        saveCrew(f, stews[sIdx % stews.length], "Стюардесса");
        saveCrew(f, stews[(sIdx + 1) % stews.length], "Стюардесса");
    }

    private void saveCrew(Flight f, String fullName, String profession) {
        String[] parts = fullName.split(" ");
        CrewMember c = new CrewMember();
        c.setFirstName(parts[0]);
        c.setLastName(parts[1]);
        c.setProfession(profession);
        c.setFlight(f);
        crewRepository.save(c);
    }
}

// --- КЛАССЫ СУЩНОСТЕЙ (Entities) ---

@Entity
@Data @NoArgsConstructor
class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String login;
    private String password;
    private String role;
    public User(String l, String p, String r) { login=l; password=p; role=r; }
}

@Entity
@Data
class Flight {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String flightNumber;
    private String departurePlace;
    private String arrivalPlace;
    private Date departureTime;
    private Date arrivalTime;
    
    // В Node.js мы делали include: CrewMember. Здесь это работает автоматически через связь.
    // JsonIgnoreProperties нужен, чтобы не было зацикливания JSON
    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("flight")
    private List<CrewMember> crewMembers;
}

@Entity
@Data
class CrewMember {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String middleName;
    private String profession;
    private String phone;
    
    @ManyToOne
    @JoinColumn(name = "flight_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("crewMembers")
    private Flight flight;
}

// --- ИНТЕРФЕЙСЫ ДЛЯ БД (Repositories) ---

interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLoginAndPassword(String login, String password);
}
interface FlightRepository extends JpaRepository<Flight, Long> {}
interface CrewMemberRepository extends JpaRepository<CrewMember, Long> {}