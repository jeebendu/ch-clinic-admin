package com.jee.clinichub.global.utility;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.stereotype.Component;

@Component
public class TypeConverter {
	
	public  byte[] fileToByteArray(File file)
	        throws IOException
	    {
	 
	        // Creating an object of FileInputStream to
	        // read from a file
	        FileInputStream fl = new FileInputStream(file);
	 
	        // Now creating byte array of same length as file
	        byte[] arr = new byte[(int)file.length()];
	 
	        // Reading file content to byte array
	        // using standard read() method
	        fl.read(arr);
	 
	        // lastly closing an instance of file input stream
	        // to avoid memory leakage
	        fl.close();
	 
	        // Returning above byte array
	        return arr;
	    }

}
