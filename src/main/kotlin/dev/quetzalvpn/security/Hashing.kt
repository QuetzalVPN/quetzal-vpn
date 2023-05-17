package dev.quetzalvpn.security

import java.security.SecureRandom
import java.security.spec.KeySpec
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

fun ByteArray.toHexString() = joinToString("") { "%02x".format(it) }

class Hashing (private val secret: String){
    private val ALGORITHM = "PBKDF2WithHmacSHA512"
    private val ITERATIONS = 210_000
    private val KEY_LENGTH = 256
    private val SECRET = secret
    private val SALT_LENGTH_BYTES = 16



    private fun generateRandomSalt(): ByteArray {
        val random = SecureRandom()
        val salt = ByteArray(SALT_LENGTH_BYTES)
        random.nextBytes(salt)
        return salt
    }

    private fun generatePasswordHash(password: String, salt: String): String {
        val combinedSalt = "$salt$SECRET".toByteArray()
        val factory: SecretKeyFactory = SecretKeyFactory.getInstance(ALGORITHM)
        val spec: KeySpec = PBEKeySpec(password.toCharArray(), combinedSalt, ITERATIONS, KEY_LENGTH)
        val key: SecretKey = factory.generateSecret(spec)
        val hash: ByteArray = key.encoded
        return hash.toHexString()
    }

    fun generateHash(password: String): String {
        val salt = generateRandomSalt().toHexString()
        return salt + ":" + generatePasswordHash(password, salt)
    }

    fun validatePassword(password: String, hash: String): Boolean {
        val parts = hash.split(":")
        val salt = parts[0]
        val passwordHash = parts[1]

        return generatePasswordHash(password, salt) == passwordHash
    }
}