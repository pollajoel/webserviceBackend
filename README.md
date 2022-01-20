# TchatNodeProject
Un projet de tchat en Nodejs natif avec 3 serveurs(2 serveurs clients et un serveur de registre)

Serveur de Régistre
  Il conserve une liste d'utilisateurs connectés qu'il met à jour à chaque intervalle de temps. La mise à jour des utilisateur se fait de façon suivante:
  Soit le client demande à se connecter en envoyant en post son @IP, son numéro de port et son username et dans ce cas le client est ajouter dans la liste des utilisateurs connectés et reçoit en retour la liste des utilisateurs connectés
  
