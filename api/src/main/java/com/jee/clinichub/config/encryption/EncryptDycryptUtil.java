package com.jee.clinichub.config.encryption;

public interface EncryptDycryptUtil {
	
	String encrypt(String plainText);
	String decrypt(String encryptedText);

}
