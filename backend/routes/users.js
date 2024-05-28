var express = require('express');
var router = express.Router();



///// logique de base de données ////
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  mail: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  admin: Boolean
});

const User = mongoose.model('User', userSchema);


// Récupérer tous les utilisateurs
router.get('/', async function(req, res) {
  try {
      const users = await User.find({}); 
      res.json(users);
  } catch (error) {
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

// Récupérer un utilisateur par un id
router.get('/:id', async function(req, res) {
  try {
      const { id } = req.params;
      const user = await User.findOne({_id: id});
      res.json(user);
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
  }
});

// Connexion
router.post('/login', async function(req, res) {
  const { mail, password } = req.body;
  try {
      const user = await User.findOne({ mail: mail });

      if (user && await bcrypt.compare(password, user.password)) {
          req.session.userId = user._id;
          req.session.isAdmin = user.admin;
          res.send('Connexion réussie');
      } else {
          res.status(401).send('Identifiants incorrects');
      }
  } catch (error) {
      res.status(500).send('Erreur serveur');
  }
});

// Inscription
router.post('/register', async function(req, res) {
  const { firstName, lastName, mail, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ mail: mail });
    if (existingUser) {
        return res.status(409).send('Un utilisateur avec cette adresse mail existe déjà.');
    }

    // Hacher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
        firstname: firstName,
        lastname: lastName,
        mail: mail,
        password: hashedPassword,
        admin: false
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    // Envoyer une réponse réussie
    res.status(201).send('Utilisateur enregistré avec succès');
  } catch (error) {
      res.status(500).send('Erreur serveur');
  }
});

// Modification d'un utilisateur
router.put('/user/:id', async function(req, res) {
  const { id } = req.params;
  const { mail, password, firstName, lastName, admin } = req.body;

  try {
    // Créer l'objet de mise à jour basique sans inclure le champ admin
    const hashedPassword = await bcrypt.hash(password, 8);
    let updateData = {
        mail: mail,
        password: hashedPassword,
        firstname: firstName,
        lastname: lastName
    };

    // Si l'utilisateur est un admin, ajouter le champ admin à l'objet de mise à jour
    if (req.session.isAdmin) {
        updateData.admin = admin;
    }

    // Effectuer la mise à jour avec les données appropriées
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (user) {
        res.send(`Utilisateur ${user._id} mis à jour.`);
    } else {
        res.status(404).send("Utilisateur non trouvé.");
    }
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});

// Supprimer un utilisateur
router.delete('/user/:id', async function(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndRemove(id);

    if (user) {
        res.send(`Utilisateur ${user._id} supprimé.`);
    } else {
        res.status(404).send("Utilisateur non trouvé.");
    }
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});



module.exports = router;
