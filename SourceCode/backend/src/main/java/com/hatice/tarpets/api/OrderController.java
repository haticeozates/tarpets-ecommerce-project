package com.hatice.tarpets.api;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React Frontend
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private static final String STRIPE_API_KEY = "sk_test_51SeFsQADFScXHxXE2kS8uyL1lyRkyntIfLinZMEsZsq262ye3FCuiz9OwENLcJJPyQdQeiyjgTXdvkEBLbZnCMSr00TYaNHMua";

    // 1. Initialize Payment & Create Stripe Checkout Session
    @PostMapping("/create-checkout-session")
    public Map<String, String> createCheckoutSession(@Valid @RequestBody CreateOrderRequest request) throws Exception {
        // Configure Stripe API Key
        Stripe.apiKey = STRIPE_API_KEY;

        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setLocale(SessionCreateParams.Locale.EN) // Ensure Checkout UI is in English
                .setUiMode(SessionCreateParams.UiMode.EMBEDDED)
                .setReturnUrl("http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}")
                .setShippingAddressCollection(
                        SessionCreateParams.ShippingAddressCollection.builder()
                                .addAllowedCountry(SessionCreateParams.ShippingAddressCollection.AllowedCountry.TR)
                                .build());

        // Loop through cart items and add them to Stripe Session
        for (CreateOrderRequest.Item itemDto : request.getItems()) {
            paramsBuilder.addLineItem(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(Long.valueOf(itemDto.getQuantity()))
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency("try")
                                            .setUnitAmount((long) (itemDto.getPrice() * 100)) // Amount in cents
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName("Pet Product") // Generic name for line item
                                                            .build())
                                            .build())
                            .build());
        }

        Session session = Session.create(paramsBuilder.build());

        Map<String, String> responseData = new HashMap<>();
        responseData.put("clientSecret", session.getClientSecret());

        return responseData;
    }

    // 2. Retrieve Orders for a Specific User
    @GetMapping("/orders/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // 3. Retrieve All Orders (Admin Dashboard)
    @GetMapping("/orders")
    public List<Order> getAllOrders(@RequestHeader(value = "Authorization", required = false) String auth) {
        String token = null;
        if (auth != null && auth.startsWith("Bearer ")) token = auth.substring(7);

        // Security check: Only allow ADMIN role
        if (token == null || !jwtUtil.validateToken(token) || !"ADMIN".equals(jwtUtil.getRoleFromToken(token))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        return orderRepository.findAll();
    }

    // 4. Save Order to Database (After successful payment)
    @PostMapping("/orders")
    public boolean createOrder(@Valid @RequestBody CreateOrderRequest request) throws Exception{

        request.setUserId(request.getUserId());
        Order order = new Order();

        // Retrieve User entity from DB
        order.setUser(userRepository.findById(request.getUserId()).orElse(null));
        order.setTotalPrice(request.getTotalPrice());
        order.setCreatedAt(LocalDateTime.now());

        // Map request items to OrderItem entities
        if (request.getItems() != null) {
            for (CreateOrderRequest.Item itemReq : request.getItems()) {
                OrderItem item = new OrderItem();
                item.setPrice(itemReq.getPrice());
                item.setQuantity(itemReq.getQuantity());
                item.setOrder(order);

                // Set Product reference (Proxy object)
                Product p = new Product();
                p.setId(itemReq.getProductId());
                item.setProduct(p);

                order.getItems().add(item);
            }
        }

        orderRepository.save(order);
        return true;
    }
}