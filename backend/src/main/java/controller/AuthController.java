package controller;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Connect to your React app
public class AuthController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody Doctor doctor) {
        if (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }
        // Encrypt the password before saving
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        return ResponseEntity.ok(doctorRepository.save(doctor));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        return doctorRepository.findByEmail(email)
            .filter(doctor -> passwordEncoder.matches(password, doctor.getPassword()))
            .map(doctor -> ResponseEntity.ok("Authentication Successful"))
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials"));
    }
}