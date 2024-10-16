package com.example.backend.config;

import com.example.backend.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET_KEY ="8f135a1b0813a667bad56b8f241c83e2d44e2800cd0bed014eb77d0d367f2bdcb336d9ddae5ac5fc79e372828123ebea43de0aa7de82803a2f15fdd9b5c7780d";
    SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
    public String extractUserName(String token) {
        return extractClaim(token , Claims::getSubject);
    }

    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(User userDetails){
        return generateToken(new HashMap<>() , userDetails);
    }
    public String generateToken(
            Map<String, String> extraClaims,
            User userDetails
    ){

      extraClaims.put("firstName", userDetails.getFirstName());
      extraClaims.put("lastName",userDetails.getLastName());
      extraClaims.put("email",userDetails.getEmail());
      extraClaims.put("schoolNo" , userDetails.getSchoolNo());
      extraClaims.put("role" , userDetails.getRole().toString());

        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 *24))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        System.out.println("Extracted username from token: " + username);
        System.out.println("UserDetails username: " + userDetails.getUsername());
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token){
        return extractExpiriton(token).before(new Date());
    }

    private Date extractExpiriton(String token) {
        return extractClaim(token , Claims::getExpiration);
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
