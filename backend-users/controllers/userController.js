const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, mail, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, mail, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updateData = req.body;

        // Vérifiez si le mot de passe est fourni avant de le hacher
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Trouver l'utilisateur par email
      const user = await User.findOne({ mail: email });
      console.log("Email reçu:", email);
        console.log("Utilisateur trouvé:", user);

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      // Comparer le mot de passe soumis avec le mot de passe haché stocké
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }
  
      // Le mot de passe correspond, continuer avec la création de session ou token JWT
      res.status(200).json({ message: "Connexion réussie", user: user });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur interne", error });
    }
  };
  