
const date = new Date().toISOString();

export const object = {
    name: 'test',
    date,
    camelCase: 1,
    modal: {
        create: {
            open: false,
        }
    }
}

export const keys = ['name', 'date', 'camelCase', 'modal', 'modal.create', 'modal.create.open']

export const namesByKeys = [
    {
        handlerName: 'changeName',
        key: ['name'],
    },
    {
        handlerName: 'changeDate',
        key: ['date'],
    },
    {
        handlerName: 'changeCamelCase',
        key: ['camelCase'],
    },
    {
        handlerName: 'changeModal',
        key: ['modal'],
    },
    {
        handlerName: 'changeModalCreate',
        key: ['modal', 'create'],
    },
    {
        handlerName: 'changeModalCreateOpen',
        key: ['modal', 'create', 'open'],
    },
]

export const handlerNames = namesByKeys.map(e => e.handlerName);

export const actionByMetaMap: Record<string, unknown> = {
    'manager/changeCounter': {
        fieldName: 'counter',
        managerName: 'manager',
    },
    'secondManager/changeCamelCase': {
        fieldName: 'camelCase',
        managerName: 'secondManager',
    },
    'thirdManager/changeModalCreateOpen': {
        fieldName: 'modalCreateOpen',
        managerName: 'thirdManager',
    },
}