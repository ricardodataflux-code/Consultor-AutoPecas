import handler from './api/query-part';

const req = {
  method: 'POST',
  body: { part: 'Amortecedor', vehicle: 'Onix' }
};

const res = {
  status: (code) => {
    console.log("STATUS:", code);
    return res;
  },
  json: (data) => {
    console.log("JSON:", data);
  }
};

handler(req as any, res as any).catch(console.error);
