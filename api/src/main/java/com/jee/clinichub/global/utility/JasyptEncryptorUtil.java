package com.jee.clinichub.global.utility;

import org.jasypt.util.text.AES256TextEncryptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JasyptEncryptorUtil {

    @Value("${jasypt.encryptor.password}")
    String secretKey;

    public String encrypt(String password, String secretKey) {
        AES256TextEncryptor textEncryptor = new AES256TextEncryptor();
        textEncryptor.setPassword(secretKey);
        return textEncryptor.encrypt(password);
    }

    public void generate() {
        String password = "4EZAquC_EqakiwaStaH";

        String encryptedPassword = encrypt(password, secretKey);
        log.info("Encrypted Password: " + encryptedPassword);
    }
}