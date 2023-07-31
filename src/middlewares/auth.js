/*
  function checkLogin(req, res, next) {
    if (!req.session.user) return res.redirect("/login");
    next();
  }
*/
function checkLogin(req, res, next) {
 
 /* if (!req.session.user.email || !req.session.user.password) {
    const error = CustomError.createError({
      name: "Authentication error",
      cause: authenticationErrorInfo(),
      message: "Error authenticating user",
      code: ErrorCode.AUTHENTICATION_ERROR,
      status: 401,
    });
    
    return next(error);
  }*/
  if (!req.session.user) {
    return res.redirect("/login");

  }
  next();
}

  
  function checkLogged(req, res, next) {
    if (req.session.user) return res.redirect("/login");
    next();
  }
  
  function checkSession(req, res, next) {
    if (req.session.user) return res.redirect("/");
    next();
  }
///////////////////////////////////////////////////////////////////////
  function checkPermisosAdministrador(req, res, next) {
    
 
    if (req.session.user.role==="user")
    { 
     
      return res.status(401).send({ status: 'Error', error: "You cannot access to this place" });
    }
else
    {   
      next();
     }
       
  }
///////////////////////////////////////////////////////////////

  function checkPermisosUsuario(req, res, next) {
   
   
    if (req.session.user.role==="admin")
         
         { 
         
          return res.status(401).send({ status: 'Error', error: "You cannot access to this place" });
        }
    else
        {   
          next();
         }
       
  }
  
  
  export { checkLogged, checkLogin, checkSession, checkPermisosAdministrador,checkPermisosUsuario };