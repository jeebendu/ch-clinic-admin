package com.jee.clinichub.config.encryption;

import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.config.env.EnvironmentProp;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class AesEncryption {

    @Autowired
    private EnvironmentProp environment;
	
	public String decrypt(String encryptedData) throws Exception {
        byte[] keyBytes = environment.getAesKey().getBytes("UTF-8");
        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec ivParameterSpec = new IvParameterSpec(keyBytes);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);

        byte[] decodedData = Base64.getDecoder().decode(encryptedData);
        byte[] original = cipher.doFinal(decodedData);

        return new String(original, "UTF-8");
    }

}
