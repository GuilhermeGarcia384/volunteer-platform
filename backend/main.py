from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.engine.url import make_url
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

api = FastAPI()

# CORS
api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexão usando DATABASE_URL
def get_connection():
    try:
        url = make_url(os.getenv("DATABASE_URL"))
        return pymysql.connect(
            host=url.host,
            port=url.port or 3306,
            user=url.username,
            password=url.password,
            db=url.database,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
    except Exception as e:
        raise e

# MODELS
class DadosInscricao(BaseModel):
    nome: str
    nascimento: str
    cpf: str
    mensagem: str
    oportunidade_id: int

class OportunidadeONG(BaseModel):
    titulo: str
    descricao: str
    ong_nome: str
    endereco: str
    latitude: str
    longitude: str

# ENDPOINTS
@api.get("/oportunidades")
async def consultar_oportunidades():
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM oportunidades")
            return cursor.fetchall()
    except Exception as e:
        return JSONResponse({"error": str(e)}, 500)
    finally:
        if conn:
            conn.close()

@api.post("/inscricoes")
async def salvar_inscricao(dados: DadosInscricao):
    conn = None
    try:
        cpf = dados.cpf if len(dados.cpf) <= 11 else "00000000000"
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO voluntarios (nome, nascimento, cpf, mensagem) VALUES (%s, %s, %s, %s)",
                (dados.nome, dados.nascimento, cpf, dados.mensagem)
            )
            voluntario_id = cursor.lastrowid
            cursor.execute(
                "INSERT INTO inscricoes (voluntario_id, voluntario_nome, oportunidade_id) VALUES (%s, %s, %s)",
                (voluntario_id, dados.nome, dados.oportunidade_id)
            )
            conn.commit()
            return {"success": True}
    except Exception as e:
        if conn:
            conn.rollback()
        return JSONResponse({"error": str(e)}, 500)
    finally:
        if conn:
            conn.close()

@api.post("/ongs/oportunidades")
async def criar_oportunidade(dados: OportunidadeONG):
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO ongs (nome, endereco) VALUES (%s, %s) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)",
                (dados.ong_nome, dados.endereco)
            )
            cursor.execute(
                """INSERT INTO oportunidades 
                (titulo, descricao, latitude, longitude, ong_id, ong_nome) 
                VALUES (%s, %s, %s, %s, LAST_INSERT_ID(), %s)""",
                (dados.titulo, dados.descricao, dados.latitude, dados.longitude, dados.ong_nome)
            )
            conn.commit()
            return {"success": True}
    except Exception as e:
        if conn:
            conn.rollback()
        return JSONResponse({"error": str(e)}, 500)
    finally:
        if conn:
            conn.close()

@api.patch("/inscricoes/{inscricao_id}")
async def atualizar_status(inscricao_id: int, status: str):
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE inscricoes SET status = %s WHERE id = %s",
                (status, inscricao_id)
            )
            conn.commit()
            return {"success": True}
    except Exception as e:
        if conn:
            conn.rollback()
        return JSONResponse({"error": str(e)}, 500)
    finally:
        if conn:
            conn.close()

@api.get("/voluntarios")
async def consultar_voluntarios():
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, nome FROM voluntarios")
            return [
                {
                    "id": row["id"],
                    "name": row["nome"],
                    "address": "Endereço não disponível"
                }
                for row in cursor.fetchall()
            ]
    except Exception as e:
        return JSONResponse({"error": str(e)}, 500)
    finally:
        if conn:
            conn.close()

@api.get("/voluntarios/{voluntario_id}")
async def consultar_voluntario(voluntario_id: int):
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM voluntarios WHERE id = %s", (voluntario_id,))
            return cursor.fetchone()
    except Exception as e:
        return JSONResponse({"error": str(e)}, 500)
    finally:
        if conn:
            conn.close()
