import bcrypt from "bcryptjs";

// A fake password for this demonstration.
const password = "TutorFlow-demo-password";

const passwordHash = await bcrypt.hash(password, 12);
console.log("Hash:", passwordHash);

const correct = await bcrypt.compare(password, passwordHash);
console.log("Correct password:", correct);

const incorrect = await bcrypt.compare("wrong-password", passwordHash);
console.log("Wrong password:", incorrect);