# LAIG 2020/2021 - TP1 - Scene Graph - Times Square

## Group T05G02

| Name                | Number    | E-Mail               |
| ------------------- | --------- | -------------------- |
| João Carlos Pires   | 201806079 | up201806079@fe.up.pt |
| Maria Marta Santos  | 201604530 | up201604530@fe.up.pt |

----

## Project information

- Main strong points
  * All primitives defined
    * All with texture coordinates (triangle and rectange with afs/aft)
    * Torus, Cylinder and Sphere with all it's values (stacks, slices, loops, innerRadius and outerRadius, etc.)
  * Parser completed and with error checking, namely:
    * When there's no light defined in XML, the code adds one to be used by default
    * When there's no camera defined in XML, the code adds one to be used by default
    * When textures aren't defined in XML, the file doesn't exist or something else, the code doesn't apply it (ignores and just logs the error)
    * When materials aren't defined in XML or some error occurs, the code applied a default one
    * When a primitive isn't correctly defined or some error occurs, the code ignores and logs the error
  * Added a GUI checkbox to select whether the tiny white cube of a light is displayed or not

- Scene
  * Our scene is a Times Square replica, with...
    - ... three main buildings (all with publicity textures applied to two of their faces and one with an additional texture for the roof).
    - ... a street divided by a sidewalk with an USA flag and some flowers.
  * [Relative Link to Scene](https://git.fe.up.pt/laig/laig-2020-2021/t05/laig-t05-g02/-/blob/master/TP1/scenes/lsf_scheme.xml)

----

## Issues/Problems

- (items describing unimplemented features, bugs, problems, etc.)
