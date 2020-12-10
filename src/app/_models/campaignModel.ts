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
            public companyId:string
    ){}
    
   
    //listFecha: string;
    
}