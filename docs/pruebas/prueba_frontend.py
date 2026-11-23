"""
Prueba funcional automatizada del frontend de Citas Médicas.
Uso: python3 prueba_frontend.py <url_base> <ruta_citas-frontend> <salida.json>

Simula la sesión de un usuario en el navegador (Chromium) con la hora fijada al
22/11/2026 20:00 en zona horaria America/Chicago (UTC-6), que es la hora en la que
se grabaría la demostración. Cada verificación equivale a una fila de la lista de chequeo.
"""
import json, re, subprocess, sys
from datetime import date, timedelta
from playwright.sync_api import sync_playwright

BASE, SRC, SALIDA = sys.argv[1].rstrip('/'), sys.argv[2], sys.argv[3]
HOY = date(2026, 11, 22)          # fecha local fijada en el navegador
iso = lambda d: d.isoformat()
resultados = []


def check(cid, nombre, fn):
    try:
        detalle = fn()
        resultados.append({'id': cid, 'nombre': nombre, 'ok': True, 'detalle': detalle or ''})
    except Exception as e:  # noqa
        msg = str(e).split('\n')[0][:160]
        resultados.append({'id': cid, 'nombre': nombre, 'ok': False, 'detalle': msg})


with sync_playwright() as p:
    nav = p.chromium.launch()
    ctx = nav.new_context(timezone_id='America/Chicago', locale='es-CO', viewport={'width': 1280, 'height': 900})
    ctx.clock.set_fixed_time('2026-11-22T20:00:00-06:00')
    ctx.set_default_timeout(3500)
    pg = ctx.new_page()
    consola = []
    pg.on('console', lambda m: consola.append(m.text) if m.type == 'error' else None)

    # ---------- utilidades ----------
    def fresco():
        pg.goto(BASE + '/')
        pg.evaluate('localStorage.clear()')
        pg.goto(BASE + '/')

    def ir(ruta_menu):
        pg.get_by_role('link', name=ruta_menu, exact=True).click()

    def entrar(correo, clave):
        if '/login' not in pg.url:
            pg.locator('header nav').get_by_role('link', name='Iniciar sesión').click()
            pg.wait_for_url('**/login')
        pg.get_by_role('heading', name='Iniciar sesión').wait_for(state='visible')   # la vista ya se pintó
        pg.fill('input[name=correo]', correo)
        pg.fill('input[name=password]', clave)
        pg.get_by_role('button', name='Ingresar').click()
        pg.wait_for_url(re.compile(r'/(paciente|admin|medico)'))

    def salir():
        pg.get_by_role('button', name='Cerrar sesión').click()
        pg.wait_for_url('**/login')

    def esperar_texto(txt):
        try:
            pg.get_by_text(txt, exact=False).first.wait_for(state='visible')
        except Exception:
            raise AssertionError(f'no aparece el texto "{txt}"')

    def no_hay_texto(txt):
        if pg.get_by_text(txt, exact=False).count() > 0:
            raise AssertionError(f'aparece "{txt}" y no debería')

    JUAN = ('juan.martinez@correo.com', 'Paciente123*')
    MEDICO = ('carlos.ramirez@clinica.com', 'Medico123*')
    ADMIN = ('admin@clinica.com', 'Admin123*')

    # ---------- Autenticación y registro ----------
    def c01():
        fresco(); entrar(*JUAN)
        assert pg.url.endswith('/paciente'), pg.url
        esperar_texto('Panel del paciente')
    check('C01', 'Inicio de sesión válido lleva al panel del paciente', c01)

    def c02():
        fresco(); pg.goto(BASE + '/login')
        pg.fill('input[name=correo]', JUAN[0]); pg.fill('input[name=password]', 'Incorrecta1*')
        pg.get_by_role('button', name='Ingresar').click()
        esperar_texto('Credenciales inválidas')
    check('C02', 'Credenciales incorrectas muestran un mensaje de error', c02)

    def c03():
        fresco(); pg.goto(BASE + '/login')
        pg.get_by_role('button', name='Ingresar').click()
        esperar_texto('El correo es obligatorio.'); esperar_texto('La contraseña es obligatoria.')
        pg.fill('input[name=correo]', 'sin-arroba'); pg.get_by_role('button', name='Ingresar').click()
        esperar_texto('Formato de correo inválido')
    check('C03', 'Login valida campos vacíos y formato de correo', c03)

    def c04():
        fresco(); pg.goto(BASE + '/registro')
        pg.get_by_role('button', name='Registrarme').click()
        pg.wait_for_selector('.error-campo')
        n = pg.locator('.error-campo').count()
        assert n >= 7, f'solo {n} errores'
        pg.fill('input[name=password]', 'abc'); pg.fill('input[name=confirmacion]', 'xyz')
        pg.get_by_role('button', name='Registrarme').click()
        esperar_texto('Mínimo 8 caracteres'); esperar_texto('no coinciden')
    check('C04', 'Registro valida campos obligatorios, contraseña y confirmación', c04)

    def registrar_luis():
        pg.goto(BASE + '/registro')
        for k, v in dict(nombres='Luis', apellidos='Peña', documento='30001001', correo='luis.pena@correo.com',
                         telefono='3105550001', password='Clave1234', confirmacion='Clave1234').items():
            pg.fill(f'input[name={k}]', v)
        pg.get_by_role('button', name='Registrarme').click()
        esperar_texto('Cuenta creada correctamente')

    def c05():
        fresco(); registrar_luis()
        # documento duplicado debe rechazarse en un segundo registro (unicidad RF-03)
        for k, v in dict(nombres='Luis', apellidos='Peña', documento='30001001', correo='otro@correo.com',
                         telefono='3105550001', password='Clave1234', confirmacion='Clave1234').items():
            pg.fill(f'input[name={k}]', v)
        pg.get_by_role('button', name='Registrarme').click()
        esperar_texto('ya está registrado')
    check('C05', 'Registro válido confirma la cuenta y rechaza documentos duplicados', c05)

    def c06():
        fresco(); registrar_luis()
        pg.get_by_role('link', name='Ir a iniciar sesión').click()
        entrar('luis.pena@correo.com', 'Clave1234')
        assert pg.url.endswith('/paciente'), pg.url
        esperar_texto('Panel del paciente')
    check('C06', 'Un paciente recién registrado puede iniciar sesión', c06)

    def c07():
        fresco(); pg.goto(BASE + '/paciente')
        pg.wait_for_url('**/login')
    check('C07', 'Una ruta protegida sin sesión redirige al login', c07)

    def c08():
        fresco(); entrar(*ADMIN)
        pg.goto(BASE + '/paciente')
        pg.wait_for_url('**/admin/**'); esperar_texto('Gestión de médicos')
    check('C08', 'El administrador no puede entrar al panel del paciente', c08)

    # ---------- Paciente ----------
    def c09():
        fresco(); entrar(*JUAN)
        for t in ('Citas próximas', 'Citas atendidas', 'Notificaciones', 'Próxima cita'):
            esperar_texto(t)
    check('C09', 'El panel del paciente muestra tarjetas y la próxima cita', c09)

    def c10():
        fresco(); entrar(*JUAN); ir('Agendar cita')
        pg.get_by_role('button', name='Confirmar cita').click()
        esperar_texto('Selecciona una especialidad.'); esperar_texto('Selecciona una fecha.')
    check('C10', 'Agendar cita valida los campos obligatorios', c10)

    def c11():
        fresco(); entrar(*JUAN); ir('Agendar cita')
        pg.select_option('select[name=especialidad]', '1')
        opciones = pg.locator('select[name=medico] option').all_inner_texts()
        assert any('Carlos' in o for o in opciones), opciones
        assert not any('Ernesto' in o for o in opciones), f'aparece médico inactivo: {opciones}'
    check('C11', 'Solo se ofrecen médicos activos de la especialidad elegida', c11)

    def c12():
        fresco(); entrar(*JUAN); ir('Agendar cita')
        pg.select_option('select[name=especialidad]', '1'); pg.select_option('select[name=medico]', '1')
        pg.fill('input[name=fecha]', iso(HOY))
        b = pg.get_by_role('button', name='08:00 (ocupado)')
        b.wait_for(state='visible')
        assert b.is_disabled()
    check('C12', 'El bloque ocupado de HOY (08:00 con Carlos) aparece deshabilitado', c12)

    FECHA_NUEVA = HOY + timedelta(days=5)

    def agendar_laura(hora='09:30'):
        ir('Agendar cita')
        pg.select_option('select[name=especialidad]', '2'); pg.select_option('select[name=medico]', '2')
        pg.fill('input[name=fecha]', iso(FECHA_NUEVA))
        pg.get_by_role('button', name=hora, exact=True).click()
        pg.get_by_role('button', name='Confirmar cita').click()

    def c13():
        fresco(); entrar(*JUAN); agendar_laura()
        esperar_texto('Cita registrada')
        ir('Mis citas')
        fila = pg.locator('tr', has_text='Laura Gómez')
        fila.wait_for(state='visible'); assert 'Programada' in fila.inner_text()
    check('C13', 'Una cita agendada aparece en "Mis citas" (estado compartido)', c13)

    def c14():
        fresco(); entrar(*JUAN); agendar_laura(); ir('Mis citas')
        fila = pg.locator('tr', has_text='Laura Gómez')
        fila.get_by_role('button', name=re.compile('Cancelar')).click()
        pg.get_by_role('button', name='Sí, cancelar').click()
        esperar_texto('fue cancelada correctamente')
        assert 'Cancelada' in pg.locator('tr', has_text='Laura Gómez').inner_text()
    check('C14', 'Cancelar una cita pide confirmación y cambia su estado', c14)

    def c15():
        fresco(); entrar(*JUAN); agendar_laura(); ir('Mis citas')
        pg.locator('tr', has_text='Laura Gómez').get_by_role('button', name=re.compile('Cancelar')).click()
        pg.get_by_role('button', name='Sí, cancelar').click()
        ir('Agendar cita')
        pg.select_option('select[name=especialidad]', '2'); pg.select_option('select[name=medico]', '2')
        pg.fill('input[name=fecha]', iso(FECHA_NUEVA))
        b = pg.get_by_role('button', name='09:30', exact=True)
        b.wait_for(state='visible'); assert b.is_enabled()
    check('C15', 'Cancelar una cita libera el horario para otro paciente', c15)

    # ---------- Administrador ----------
    def crear_medico():
        ir('Gestión de médicos') if 'medicos' not in pg.url else None
        pg.get_by_role('button', name='+ Nuevo médico').click()
        pg.get_by_role('button', name='Guardar médico').click()
        esperar_texto('Mínimo 3 caracteres.'); esperar_texto('Selecciona una especialidad.')
        for k, v in dict(nombre='Sandra', apellido='Mejía', documento='10001099', telefono='3001119999',
                         correo='sandra.mejia@clinica.com').items():
            pg.fill(f'input[name={k}]', v)
        pg.select_option('select[name=id_especialidad]', '4')
        pg.get_by_role('button', name='Guardar médico').click()
        esperar_texto('creado correctamente')

    def c16():
        fresco(); entrar(*ADMIN); crear_medico()
        pg.locator('tr', has_text='Sandra Mejía').wait_for(state='visible')
    check('C16', 'El admin valida y crea un médico nuevo', c16)

    def c17():
        fresco(); entrar(*ADMIN)
        pg.get_by_role('button', name='Inactivar al médico Carlos Ramírez').click()
        esperar_texto('ahora está inactivo')
        salir(); entrar(*JUAN); ir('Agendar cita')
        pg.select_option('select[name=especialidad]', '1')
        assert not any('Carlos' in o for o in pg.locator('select[name=medico] option').all_inner_texts())
    check('C17', 'Un médico inactivado desaparece del agendamiento del paciente', c17)

    def c18():
        fresco(); entrar(*ADMIN); crear_medico(); salir(); entrar(*JUAN); ir('Agendar cita')
        pg.select_option('select[name=especialidad]', '4')
        assert any('Sandra' in o for o in pg.locator('select[name=medico] option').all_inner_texts())
    check('C18', 'Un médico creado por el admin aparece en el agendamiento', c18)

    def c19():
        fresco(); entrar(*ADMIN); pg.goto(BASE + '/admin')
        pg.wait_for_url('**/admin/medicos'); esperar_texto('Gestión de médicos')
    check('C19', '/admin redirige al primer módulo del administrador', c19)

    def c20():
        fresco(); entrar(*ADMIN); ir('Gestión de citas')
        esperar_texto('Gestión de citas')
        total = pg.locator('tbody tr').count()
        pg.select_option('select[name=estado]', 'Cancelada')
        filtradas = pg.locator('tbody tr').count()
        assert filtradas < total, (total, filtradas)
    check('C20', 'El admin consulta todas las citas y las filtra por estado', c20)

    def c21():
        fresco(); entrar(*JUAN); agendar_laura(); salir(); entrar(*ADMIN); ir('Gestión de citas')
        pg.locator('tr', has_text='Laura Gómez').wait_for(state='visible')
    check('C21', 'Una cita agendada por el paciente se ve de inmediato en la vista del admin', c21)

    # ---------- Médico ----------
    def c22():
        fresco(); entrar(*MEDICO)
        no_hay_texto('Panel del paciente'); no_hay_texto('Juan Martínez') if False else None
        esperar_texto('Agenda del médico')
    check('C22', 'El médico entra a su propio panel (no al del paciente)', c22)

    def c23():
        fresco(); entrar(*MEDICO); esperar_texto('Agenda del médico')
        filas = pg.locator('tbody tr')
        filas.first.wait_for(state='visible')
        assert 'Juan' in pg.locator('tbody').inner_text()
        assert 'Laura' not in pg.locator('tbody').inner_text()   # solo SUS citas
    check('C23', 'La agenda del médico muestra únicamente sus citas', c23)

    def c24():
        fresco(); entrar(*MEDICO); esperar_texto('Agenda del médico')
        fila = pg.locator('tr', has_text='Confirmada').first
        fila.get_by_role('button', name=re.compile('Marcar atendida')).click()
        esperar_texto('marcada como atendida')
    check('C24', 'El médico marca una cita como atendida', c24)

    def c30():
        fresco()
        pg.evaluate("localStorage.setItem('sgcm_sesion', JSON.stringify({correo:'fantasma@correo.com', rol:'paciente', nombre:'Fantasma'}))")
        pg.goto(BASE + '/paciente')
        pg.wait_for_url('**/login')
    check('C30', 'Una sesión guardada de un usuario inexistente se descarta', c30)

    def c31():
        fresco(); entrar(*ADMIN); ir('Gestión de citas')
        pg.select_option('select[name=estado]', 'Cancelada')
        esperar_texto('No hay citas con los filtros elegidos.')
    check('C31', 'Las tablas sin resultados muestran un mensaje en vez de quedar vacías', c31)

    # ---------- Calidad de código (verificación estática) ----------
    def sh(cmd):
        return subprocess.run(cmd, shell=True, cwd=SRC, capture_output=True, text=True)

    def c25():
        n = int(sh(r"grep -rE 'const CORREO_RE' src | wc -l").stdout.strip())
        assert n <= 1, f'la expresión del correo está definida {n} veces'
        return f'{n} definición'
    check('C25', 'Las validaciones están centralizadas (sin código repetido)', c25)

    def c26():
        n = int(sh(r"grep -rEn 'citas\.push|medicos\.push|\.estado = ' src/pages | wc -l").stdout.strip())
        assert n == 0, f'{n} mutaciones directas de los datos de prueba dentro de las vistas'
    check('C26', 'Las vistas no modifican directamente los datos de prueba', c26)

    def c27():
        r = sh('npx oxlint 2>&1')
        assert r.returncode == 0 and 'warning' not in r.stdout.lower() and 'error' not in r.stdout.lower(), \
            r.stdout.strip().split('\n')[0][:140]
    check('C27', 'El lint (oxlint) no reporta advertencias ni errores', c27)

    def c28():
        r = sh('npm run build 2>&1')
        assert r.returncode == 0, r.stdout[-200:]
    check('C28', 'El proyecto compila para producción (vite build)', c28)

    def c29():
        assert not consola, f'errores en consola: {consola[:2]}'
    check('C29', 'No hay errores en la consola del navegador durante la prueba', c29)

    nav.close()

ok = sum(r['ok'] for r in resultados)
resultados.sort(key=lambda r: int(r['id'][1:]))
json.dump(resultados, open(SALIDA, 'w'), ensure_ascii=False, indent=1)
for r in resultados:
    print(('OK  ' if r['ok'] else 'FALLA'), r['id'], r['nombre'], '' if r['ok'] else '→ ' + r['detalle'])
print(f'\n{ok}/{len(resultados)} verificaciones cumplen')
