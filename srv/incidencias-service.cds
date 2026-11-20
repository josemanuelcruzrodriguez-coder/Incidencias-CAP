using incidencias as db from '../db/schema';

service IncidenciasService {
    entity Incidencias as projection on db.Incidencias
        actions {
            action cerrar() returns Incidencias;
        };

    entity Comentarios as projection on db.Comentarios;

    @readonly
    entity Tecnicos    as projection on db.Tecnicos;

    @readonly
    entity Prioridades as projection on db.Prioridades;

    @readonly
    entity Estados     as projection on db.Estados;

    @readonly
    entity Categorias  as projection on db.Categorias;
}
