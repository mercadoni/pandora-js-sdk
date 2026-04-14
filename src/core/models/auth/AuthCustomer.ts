class AuthCustomer {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    documentId: string | null;
    documentType: string | null;
    uid: string | null;
    terms: boolean;
    notifications: boolean;

    constructor(config: {
        id: string;
        name?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phoneNumber?: string | null;
        documentId?: string | null;
        documentType?: string | null;
        uid?: string | null;
        terms?: boolean;
        notifications?: boolean;
    }) {
        this.id = config.id;
        this.name = config.name || null;
        this.firstName = config.firstName || null;
        this.lastName = config.lastName || null;
        this.email = config.email || null;
        this.phoneNumber = config.phoneNumber || null;
        this.documentId = config.documentId || null;
        this.documentType = config.documentType || null;
        this.uid = config.uid || null;
        this.terms = config.terms || false;
        this.notifications = config.notifications || false;
    }

    static fromJson(json: Record<string, any>): AuthCustomer {
        return new AuthCustomer({
            id: json.id,
            name: json.name,
            firstName: json.firstName,
            lastName: json.lastName,
            email: json.email,
            phoneNumber: json.phoneNumber,
            documentId: json.documentId,
            documentType: json.documentType,
            uid: json.uid,
            terms: json.terms,
            notifications: json.notifications,
        });
    }
}

export default AuthCustomer;
