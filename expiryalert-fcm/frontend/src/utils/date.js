export const fmtDate = (d) => new Date(d).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
export const daysUntil = (d) => { const t=new Date();t.setHours(0,0,0,0); const e=new Date(d);e.setHours(0,0,0,0); return Math.ceil((e-t)/86400000); };
