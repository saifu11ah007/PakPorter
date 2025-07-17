import Joi from 'joi';

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
    cnicNumber: Joi.string().pattern(/^\d{5}-\d{7}-\d{1}$/).required(), // Matches 00000-0000000-0
  }).unknown(true); // Allow extra fields
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details });
  }
  next();
};
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Should include _id
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details });
  }
  next();
};

export { loginValidation, signupValidation,authMiddleware };