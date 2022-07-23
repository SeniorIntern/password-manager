const crypto = require("crypto");
const secret = "pppppppppppppppppppppppppppppppp";

const encrypt = (password) => {
    const iv = Buffer.from(crypto.randomBytes(16));
    // setup encryption for password
    const cipher = crypto.createCipheriv(
        "aes-256-ctr",
        Buffer.from(secret),
        iv
    );

    // concat encrypted pass w/ cipher
    const encryptedPassword = Buffer.concat([
        cipher.update(password),
        cipher.final(),
    ]);

    // convert buffer to hexa decimal string then return, and iv
    return {
        iv: iv.toString("hex"),
        password: encryptedPassword.toString("hex"),
    };
};

// decrypt to buffer

const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv(
        "aes-256-ctr",
        Buffer.from(secret),
        Buffer.from(encryption.iv, "hex")
    );

    const decryptedPassword = Buffer.concat([
        decipher.update(Buffer.from(encryption.password, "hex")),
        decipher.final(),
    ]);

    return decryptedPassword.toString();
};

module.exports = { encrypt, decrypt };
