
package com.jee.clinichub.config.encryption;

import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.config.env.EnvironmentProp;

import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class AesUtilImpl implements EncryptDycryptUtil{
	
	private static final String AES = "AES";
    private Key key;
    Cipher cipher;
    
    @Autowired
    private EnvironmentProp environment;
    
    @PostConstruct
    public void init() {
        String secret =  environment.getAesKey();
        key = new SecretKeySpec(secret.getBytes(), AES);
    }

	@Override
	public String encrypt(String plainText) {
		try {
        	cipher = Cipher.getInstance(AES);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return Base64.getEncoder().encodeToString(cipher.doFinal(plainText.getBytes()));
        } catch (InvalidKeyException | BadPaddingException | IllegalBlockSizeException | NoSuchPaddingException  | NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
            // You can decide to return an empty or null value on error to be stored if don't want to throw exception
        }
	}

	@Override
	public String decrypt(String encryptedText) {
		try {
            cipher = Cipher.getInstance(AES);
            cipher.init(Cipher.DECRYPT_MODE, key);
            return new String(cipher.doFinal(Base64.getDecoder().decode(encryptedText)));
        } catch (InvalidKeyException | BadPaddingException | IllegalBlockSizeException | NoSuchPaddingException  | NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
            // You can decide to return an empty or null value on error to be returned if don't want to throw exception
        }
	}
	
	

}
