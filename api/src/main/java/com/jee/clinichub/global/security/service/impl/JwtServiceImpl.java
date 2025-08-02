package com.jee.clinichub.global.security.service.impl;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.jee.clinichub.global.security.service.JwtService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

/**
 * This class implements the JwtService interface and provides methods for generating and validating JWT tokens.
 * It also includes methods for extracting user information from the token.
 */
@Service
public class JwtServiceImpl implements JwtService {
	
    @Value("${token.signing.key}")
    private String jwtSigningKey;
    
    @Value("${jwt.token.validity}")
    private String jwtExipryTimeInSec;
    
    @Override
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }

    /**
     * Generates a JWT token with the provided extra claims and user details.
     *
     * @param extraClaims   the extra claims to include in the token
     * @param userDetails  the user details used to set the subject of the token
     * @return the generated JWT token
     */
    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
        		.setClaims(extraClaims)
        		.setSubject(userDetails.getUsername())
        		.setAudience(TenantContextHolder.getCurrentTenant())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * Integer.valueOf(jwtExipryTimeInSec)))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSigningKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

	@Override
	public String extractTenant(String token) {
		return extractClaim(token, Claims::getAudience);
	}

	@Override
	public String getTenantId(HttpServletRequest req) {
		return null;
	}
}
