
package com.jee.clinichub.global.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.jee.clinichub.global.model.Status;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;

@ControllerAdvice
public class JwtExceptionHandler {

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Status> handleExpiredJwtException(ExpiredJwtException ex) {
        return new ResponseEntity<Status>(
            new Status(false, "Your session has expired. Please login again."), 
            HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(UnsupportedJwtException.class)
    public ResponseEntity<Status> handleUnsupportedJwtException(UnsupportedJwtException ex) {
        return new ResponseEntity<Status>(
            new Status(false, "Unsupported token type. Please login again."), 
            HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<Status> handleMalformedJwtException(MalformedJwtException ex) {
        return new ResponseEntity<Status>(
            new Status(false, "Invalid token format. Please login again."), 
            HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<Status> handleSignatureException(SignatureException ex) {
        return new ResponseEntity<Status>(
            new Status(false, "Invalid token signature. Please login again."), 
            HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Status> handleIllegalArgumentException(IllegalArgumentException ex) {
        // Only handle JWT-related IllegalArgumentExceptions
        if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("jwt")) {
            return new ResponseEntity<Status>(
                new Status(false, "Invalid token. Please login again."), 
                HttpStatus.UNAUTHORIZED
            );
        }
        // Let other IllegalArgumentExceptions be handled by default handlers
        throw ex;
    }
}
