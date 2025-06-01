from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import users, clients, proposals, proposal_items, device, contracts, contract_applications, \
    application_items, statuses

app = FastAPI(title="Проект на FastAPI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(engine)
app.include_router(clients.router, prefix="/clients", tags=["clients"])

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(proposals.router, prefix="/proposals", tags=["proposals"])
app.include_router(proposal_items.router, prefix="/proposal_items", tags=["proposal_items"])
app.include_router(device.router, prefix="/devices", tags=["devices"])
app.include_router(contracts.router, prefix="/contracts", tags=["contracts"])
app.include_router(contract_applications.router, prefix="/contract_applications", tags=["contract_applications"])
app.include_router(application_items.router, prefix="/application_items", tags=["application_items"])
app.include_router(statuses.router, prefix="/statuses", tags=["statuses"])



@app.get("/")
def read_root():
    return {"message": "Добро пожаловать в проект!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
