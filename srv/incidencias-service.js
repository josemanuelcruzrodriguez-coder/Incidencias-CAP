const cds = require('@sap/cds')

module.exports = class IncidenciasService extends cds.ApplicationService {
    init() {
        const { Incidencias } = this.entities

        // 8.2 · Al crear: número correlativo, estado Nueva y fecha de hoy
        this.before('CREATE', Incidencias, async req => {
            const res = await SELECT.one.from(Incidencias).columns('max(numero) as max')
            req.data.numero = (res?.max ?? 0) + 1
            req.data.estado_code = 'N'
            req.data.fechaApertura = new Date().toISOString().slice(0, 10)
        })

        // 8.3 · Validaciones al crear y al modificar
        this.before(['CREATE', 'UPDATE'], Incidencias, req => {
            const { titulo, prioridad_code } = req.data
            if (titulo !== undefined && (titulo ?? '').trim().length < 5)
                req.error(400, 'El título debe tener al menos 5 caracteres', 'titulo')
            if (prioridad_code !== undefined && !['1', '2', '3'].includes(prioridad_code))
                req.error(400, 'Prioridad no válida: usa 1 (Alta), 2 (Media) o 3 (Baja)', 'prioridad_code')
        })
        // 8.4 · Acción cerrar
        this.on('cerrar', Incidencias, async req => {
            const inc = await SELECT.one.from(req.subject)
            if (!inc) return req.error(404, 'Incidencia no encontrada')
            if (inc.estado_code === 'C') return req.error(409, 'La incidencia ya está cerrada')
            await UPDATE(req.subject).with({
                estado_code: 'C',
                fechaCierre: new Date().toISOString().slice(0, 10)
            })
            return SELECT.one.from(req.subject)
        })
        // 8.5 · Después de leer: criticidad para colorear (1 rojo, 2 amarillo, 3 verde)
        this.after('READ', Incidencias, data => {
            for (const fila of [].concat(data)) {
                if (fila) fila.criticidad = { '1': 1, '2': 2, '3': 3 }[fila.prioridad_code] ?? 0
            }
        })
        return super.init()
    }
}