# Projet intégrateur front-end

[![Checkly Badge](https://api.checklyhq.com/v1/badges/checks/e709cb3b-807d-4e5f-8f64-c7906fb01fe4?style=for-the-badge&theme=default)](https://univox.checkly-dashboards.com/) [![Made With Svelte Badge](https://img.shields.io/badge/made%20with-svelte%20kit-orange?style=for-the-badge)](https://kit.svelte.dev/) [![GNU license](https://img.shields.io/badge/License-GNU%20V3-blue?style=for-the-badge)](./LICENSE)

Équipe 3

Univox

- Auteurs :
Laurent Stephane, Maxime Rodgers, Henri-Louis Charbonneau, Eliott Bonnefoy, Alexandre Veregut.
Nous sommes des étudiants au Collège Bois-De-Boulogne dans le programme de Science Informatique et Mathématique qui se sont regrouppés pour créer une application web dans le cadre de notre d'un projet d'intégration de la fin de notre programme

- Quel(s) sont le(s) problème(s) ? :

  Dans le cadre du Cégep:
  
  Il arrive souvent que les étudiant.e.s aient à consulter leurs horaire et celui d'autres personnes pour organiser des rencontres ou des activités à plusieurs; dans
  ces cas-là, il faut que ces dernier.e.s partagent leurs horaires et trouvent eux-mêmes les moments où tout le monde est disponible, ce qui peut parfois être
  laborieux s'il y a beaucoup de personnes impliquées.
  
  De plus, il n'existe pas de solution d'échange de matériel scolaire usagé entre élèves spécialisé: la Coop permet de vendre et d'acheter des livres usagés, mais le
  vendeur doit faire la démarche d'aller rendre son ouvrage et l'acheteur doit le payer à la Coop. Pour cette raison, les élèves n'utilisent pas forcément beaucoup ce service et ils doivent chercher eux-même parmis leurs contacts ou sur des sites de vente non spécialisés (ex.: Kijiji).
  
  Finalement, ce n'est pas toujours facile pour un.e nouvel.le élève de trouver un.e partenaire de casier lorsqu'il ou elle ne connaît personne.
  
  Pour chacun de ces problèmes, il n'existe pas de solutions spécialisée pensée et optimisée autour d'un environnement étudiant.
  De plus, au-delà d'une optique estudiantine, il n'existe pas de solution regroupant les services qui répondraient à ces problèmes.
  


- La solution :

  Ainsi, nous avons décidé de développer une application web pour répondre à ces besoins. Cette application permettrait aux étudiants de s'organiser clairement dans un
  environnement commun.

  Pour commencer, nous prévoyons de nous concentrer surtout sur l'organisation des horaires: proposer une plateforme d'échange de matériel usagé et de recherche de
  partenaire de casier seraient des objectifs secondaires sur lesquels nous pensons travailler seulement après avoir terminé (ou pratiquement terminé) la fonction de
  partage/mdification/organisation d'horaires, ce qui comprend les organisations de groupes de personnes (cela est détaillé plus bas).

  Tout d'abord, en ce qui concerne les horaires, les utilisateurs pourront téléverser leurs horaires d'Omnivox sur notre site et le modifier ensuite; la fonction de
  modification d'horaire permettrait aussi de créer un horaire à partir de rien. Le site saurait interpréter l'horaire et définir les plages de disponibilités d'un
  utilisateur automatiquement et qui pourrait ensuite relver les périodes de disponibilités 

Nous avons donc pensé qu'il serait pertinent de proposer une fonction de recherche de partenaire de casier en fonction de certains critères, comme les centres d'intérêts et/ou les disponibilités en fonction de l'horaire.

- L'architecture : 
Pour le front-end, nous allons utiliser les combinaisons classiques de HTML, CSS et JavaScript pour l'affichage du site. Tailwind, une librairie CSS, nous permettera de travailler l'aspect graphique du site avec une plus grande liberté que Bootstrap, tout en restant plus facile d'utilisation que simplement du CSS

csharp asp - ado
java springboot-jdbc - hibernate
pyhton django4
