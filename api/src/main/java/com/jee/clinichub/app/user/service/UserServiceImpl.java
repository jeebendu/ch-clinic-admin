package com.jee.clinichub.app.user.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.core.files.CDNProviderService;
import com.jee.clinichub.app.core.mail.MailRequest;
import com.jee.clinichub.app.core.mail.MailService;
import com.jee.clinichub.app.core.mail.smtp.service.SmtpServiceImpl;
import com.jee.clinichub.app.core.slider.model.SliderDto;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.staff.repository.StaffRepository;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.model.UserAuth;
import com.jee.clinichub.app.user.model.UserDto;
import com.jee.clinichub.app.user.repository.UserAuthRepository;
import com.jee.clinichub.app.user.repository.UserRepository;
import com.jee.clinichub.app.user.role.repository.RoleeRepository;
import com.jee.clinichub.app.user.role.service.RoleService;
import com.jee.clinichub.config.encryption.AesEncryption;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.service.TenantService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "userService")
public class UserServiceImpl implements UserDetailsService, UserService, ApplicationEventPublisherAware {

    private static final Logger log = LoggerFactory.getLogger(RoleService.class);

    @Autowired
    private RoleService roleService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAuthRepository userAuthRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private RoleeRepository roleRepository;

    @Autowired
    TenantService tenantService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    AesEncryption aesEncryption;

    @Autowired
    MailService mailService;

    @Autowired
    StaffRepository staffRepository;

    @Autowired
    CDNProviderService cdnProviderService;

    @Value("${upload.root.folder}")
    private String TENANT_ROOT;

    public final String FS = "/";

    private Map<String, String> mapValue = new HashMap<>();
    private Map<String, String> userDbMap = new HashMap<>();

    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.publisher = applicationEventPublisher;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // String username =usernameWithTenat.split("::x::")[1];

        UserAuth user = userAuthRepository.findByUsernameOrEmailOrPhone(username, username, username);
        if (user == null) {
            throw new UsernameNotFoundException("Invalid username or password.");
        }

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                getAuthority(user));
    }

    @Cacheable(value = "loadUserByUsername", keyGenerator = "multiTenantCacheKeyGenerator")
    public UserDetails loadUserByUsernameAndTenant(String username) {
        // String username =usernameWithTenat.split("::x::")[1];

        UserAuth user = userAuthRepository.findByUsernameOrEmailOrPhone(username, username, username);
        if (user == null) {
            throw new UsernameNotFoundException("Invalid username or password.");
        }
        // boolean enabled = !user.isVerified();

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                getAuthority(user));
    }

    private Set<SimpleGrantedAuthority> getAuthority(UserAuth user) {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));
        /*
         * user.getRoles().forEach(role -> {
         * authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
         * });
         */
        return authorities;
    }

    public List<User> findAll() {
        List<User> list = new ArrayList<>();
        userRepository.findAll().iterator().forEachRemaining(list::add);
        return list;
    }

    @Override
    public User findOne(String username) {
        return userRepository.findByUsername(username).get();
    }

    @Override
    public Status save(UserDto userDto) {

        // set database parameter
        Tenant tenant = tenantService.findByTenantId(userDto.getTenantOrClientId());
        if (null == tenant || tenant.getStatus().toUpperCase().equals("INACTIVE")) {
            throw new RuntimeException("Please contact service provider.");
        }

        Status userStatus = validateUser(userDto);
        if (!userStatus.isStatus()) {
            return userStatus;
        }

        User user = UserDtoMaptoUser(userDto);

        userRepository.save(user);

        sendRegistrationConfirmationEmail(user);

        return new Status(true, ((userDto.getId() == null) ? "Added" : "Updated") + " Successfully");

    }

    private void sendRegistrationConfirmationEmail(User user) {
        // UserToken secureToken= userTokenService.createSecureToken();
        // secureToken.setUser(user);

        String secureToken = "11111111111111111111111";
        // userTokenService.saveSecureToken(secureToken);

        String content = "baseurl" + secureToken;

        try {
            // mailService.sendMail(mailRequest);
            MailRequest mailRequest = new MailRequest(this, "admin@clinichub.in", user.getEmail(), "User Activation",
                    content);
            publisher.publishEvent(mailRequest);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public User UserDtoMaptoUser(UserDto userDto) {
        User user = new User();
        if (userDto.getId() == null) {
            user = new User(userDto);
        } else {
            user = this.setUser(userDto);
        }

        if (userDto.getPassword() == null || userDto.getPassword().isEmpty()) {
            userDto.setPassword(userDto.getPhone());
        }
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        // user.setBranch(userDto.getBranch());
        user.setBranch(branchRepository.findBranchById(userDto.getBranch().getId()));
        user.setRole(roleRepository.findById(userDto.getRole().getId()).get());
        // user.setEffectiveFrom(new Date());
        // user.setEffectiveTo(new Date());

        // Set<Role> roles = new HashSet<>();
        // roles.add(roleService.findByName("ADMIN"));
        // user.setRole(roleService.findByName("ADMIN"));

        return user;
    }

    @Override
    public Status validateUser(UserDto user) {
log.info(TenantContextHolder.getCurrentTenant());
        boolean isExistUserName = (user.getId() == null) ? userRepository.existsByUsername(user.getUsername())
                : userRepository.existsByUsernameAndIdNot(user.getUsername(), user.getId());
        boolean isExistEmail = (user.getId() == null) ? userRepository.existsByEmail(user.getEmail())
                : userRepository.existsByEmailAndIdNot(user.getEmail(), user.getId());
        boolean isExistMobile = (user.getId() == null) ? userRepository.existsByPhone(user.getPhone())
                : userRepository.existsByPhoneAndIdNot(user.getPhone(), user.getId());

        if (isExistUserName)
            return new Status(false, "Username already exist");
        // if(isExistEmail)return new Status(false,"Email already exist");
        if (isExistMobile)
            return new Status(false, "Mobile number already exist");
        return new Status(true, "User Ok");

    }

    @Override
    public User setUser(UserDto userDto) {
        User user = userRepository.findById(userDto.getId()).get();
        // user.setName(userDto.getName());
        // user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());
        return user;
    }

    @Override
    public User setUser(User user) {
        // user.setName(user.getName());
        // user.setUsername(user.getUsername());
        user.setEmail(user.getEmail());
        user.setPhone(user.getPhone());
        return user;
    }

    @Override
    public User setUser(UserDto userDto, User user) throws IllegalArgumentException {
        user.setName((userDto.getName()!=null || !userDto.getName().equals("")) ? user.getName() : " ");
        // user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());

        if (userDto.getEffectiveTo() != null && userDto.getEffectiveFrom().compareTo(userDto.getEffectiveTo()) > 0) {
            throw new ResponseStatusException(HttpStatus.ACCEPTED,
                    "EffectiveFrom date should not be greater the EffectiveTo date");
        }
        user.setEffectiveFrom(userDto.getEffectiveFrom());
        user.setEffectiveTo(userDto.getEffectiveTo());
        user.setBranch(branchRepository.findBranchById(userDto.getBranch().getId()));
        user.setRole(roleRepository.findById(userDto.getRole().getId()).get());

        return user;
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> userList = userRepository.findAll();
        List<UserDto> roleDtoList = userList.stream().map(UserDto::new).collect(Collectors.toList());
        return roleDtoList;
    }

    @Override
    public UserDto getById(Long id) {

        UserDto userDto = new UserDto();
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isPresent()) {
                userDto = new UserDto(user.get());
            }
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return userDto;

    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<User> user = userRepository.findById(id);

            if (!user.isPresent()) {
                return new Status(false, "User Not Found");
            }

            userRepository.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return new Status(false, "Something went wrong");
    }

    private String getAuthenticatedUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.info("User not authenticated");
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    @Override
    public User getCurrentUser() {
        String username = getAuthenticatedUsername();
        if (username == null) {
            return null;
        }

        log.info("Authenticated user: " + username);
        return userRepository.findByUsername(username).orElse(null);
    }

    @Override
    public Staff getCurrentStaff() {
        String username = getAuthenticatedUsername();
        if (username == null) {
            return null;
        }

        log.info("Authenticated user: " + username);
        return staffRepository.findByUser_Username(username).orElse(null);
    }

    @Override
    public Status uploadProfile(MultipartFile slider, boolean b, String tenant, Long id) {

        String isFile = StringUtils.cleanPath(slider.getOriginalFilename());
        if (isFile.contains("..")) {
            throw new IllegalStateException("Cannot upload empty file");
        }

        String tenantPath = TENANT_ROOT + FS + tenant;
        String isPublicOrPrivate = b ? "public" : "private";
        String sliderName = String.format("%s", slider.getOriginalFilename());
        String sliderPath = tenantPath + FS + isPublicOrPrivate + FS + sliderName;

        try {
            String filename = cdnProviderService.upload(slider, sliderPath);

            User user=userRepository.findById(id).get();
            user.setImage(filename);
         userRepository.save(user);
         return new Status(true, "Profile image uploaded successfully");

        } catch (Exception ex) {
            log.error("Error occurred while uploading: " + ex.getMessage());
            return new Status(false, "something went wrong");
        }

    }

}