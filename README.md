# Univox

[![Checkly Badge](https://api.checklyhq.com/v1/badges/checks/e709cb3b-807d-4e5f-8f64-c7906fb01fe4?style=for-the-badge&theme=default)](https://univox.checkly-dashboards.com/) [![Made With Svelte Badge](https://img.shields.io/badge/made%20with-svelte%20kit-orange?style=for-the-badge)](https://kit.svelte.dev/) [![GNU license](https://img.shields.io/badge/License-GNU%20V3-blue?style=for-the-badge)](./LICENSE)

Équipe 3

- Auteurs :
Notre équipe est composer de :
  Laurent Stephane
  Maxime Rodgers
  Henri-Louis Charbonneau
  Eliott Bonnefoy
  Alexandre Veregut
  
Nous sommes des étudiants au Collège Bois-De-Boulogne. Nous étudions dans le programme de Science Informatique et Mathématique, et nous nous sommes regrouppés pour créer une application web dans le cadre de notre cours.

- Quel(s) sont le(s) problème(s) ? :

  Dans le cadre du Cégep, nous avons trouvé quelques petits problèmes:
  
  Il arrive souvent que les étudiant(e)s aient à consulter leur horaire et celui des autres pour organiser des rencontres ou des activités en groupe;
  Par exemple, pour des projet ou des sortits entre amis;
  Dans ces cas-là, il est compliqué de s'organiser parce qu'il faut non-seulement arriver à partager les horaires entre-eux, mais aussi à trouver les moments où tout
  le monde est disponible en cherchant à travers plusieurs encadrés de la même couleurs et sans-code de couleur. Ceci est bien-sûr laborieux, et encore plus difficile
  s'il y a beaucoup de personnes impliquées.
  
  De plus, il n'y a pas de solution simple d'échange de matériel scolaire entre élèves :
  La Coop permet de vendre et d'acheter des livres usagés, mais le processus est peu mis en avant ;

  L'élève doit se rendre à la coop dans une plage horaire précise afin de remettre ses livres usagés et ensuite c'est la coop qui se charge de la revente; cela pose deux problèmes: d'abord, le fait qu'il faille se déplacer pour mettre son matériel usagé en vente et ensuite, le fait que cette pratique soit assez peu mise en avant: par exemple, un tel service n'est pas visible sur le site de la Coop BdeB. Pour ces raisons, les élèves ou anciens élèves qui souhaitent vendre ou échanger du matériel scolaire dont ils ou elles n'ont plus l'utilité se rendent sur des sites tiers (ex.: Kijiji).

  Finalement, il est aussi compliqué de se trouver un compagnon de casier si on ne connait personne.
  L'option de s'inscrire individuellement afin de se faire placer automatiquement n'existant plus, on est obligé de s'inscrire avec quelqu'un.
  
  Pour chacun de ces problèmes, il n'existe pas de solution simple et organisé autour d'un environnement étudiant.
  De plus, au-delà d'une optique estudiantine, il n'existe pas de solution regroupant les services qui répondraient à ces problèmes.
  
  Notre projet essai de remédier à cela.
  
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
