package com.jee.clinichub.global.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@ControllerAdvice
@Log4j2
public class GlobalResponseEntityExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Status> handleEntityNotFoundException(EntityNotFoundException ex) {
        return new ResponseEntity<Status>(new Status(false, ex.getMessage()), HttpStatus.OK);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Status> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        return new ResponseEntity<>(new Status(false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

     @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Status> handleBadCredentialsException(BadCredentialsException ex) {
        return new ResponseEntity<>(new Status(false, "Invalid username or password."), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AuthenticationServiceException.class)
    public ResponseEntity<Status> handleAuthException(AuthenticationServiceException ex) {
        return new ResponseEntity<Status>(new Status(false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserNotActiveException.class)
    public ResponseEntity<Status> handleUserNotActiveException(UserNotActiveException ex) {
        return new ResponseEntity<>(new Status(false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Status> handleAccessDeniedException(AccessDeniedException ex) {
        return new ResponseEntity<>(new Status(false, "Access denied."), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Status> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        return new ResponseEntity<>(new Status(false, "Validation error: " + ex.getBindingResult().getFieldError().getDefaultMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Status> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
        return new ResponseEntity<>(new Status(false, "Method not allowed."), HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Status> handleGlobalException(Exception ex) {
    	log.error("Unhandled exception occurred", ex); 
        return new ResponseEntity<Status>(new Status(false, "An unexpected error occurred."), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    

}