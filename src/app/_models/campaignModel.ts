

export class Campaign {
    constructor(
            public _id: string,
            public nombre: string,
            public fechaCreacion: string,
            public totalEmails: string,
            public countDeliverys:Int32Array,
            public countSends:Int32Array,
            public countRejects:Int32Array,
            public countOpens:Int32Array,
            public companyId:string,
            public countBounces:Int32Array,
            public countClicks:Int32Array,
            public clientsClicks: any,
            public clientsOpens:any,
            public clientsDeliverys:any,
            public clientsRejects:any,
            public clientsBounces:any
    ){}
    
   
    //listFecha: string;
    
}