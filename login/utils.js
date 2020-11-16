const { config } = require('../config');
const protectRoutes = express.Router(); 

const SEED_AUTENTICACION = config.seedAuth;
const EXPIRATION = config.expiration;
            
protectRoutes.use((req, res, next) => {
    const token = req.headers['access-token'];
	
    if (token) {
      jwt.verify(token, SEED_AUTENTICACION, (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    }
 });

app.get('/datos', protectRoutes, (req, res) => {
	const datos = [
		{ id: 1, nombre: "Asfo" },
		{ id: 2, nombre: "Denisse" },
		{ id: 3, nombre: "Carlos" }
	];
	
	res.json(datos);
});