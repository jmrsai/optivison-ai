export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `FirestoreError: Missing or insufficient permissions. The following request was denied by Firestore Security Rules:\n${JSON.stringify(context, null, 2)}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
    
    // This is to make the error object serializable for the Next.js overlay
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }

  toContextObject() {
    return {
        message: this.message,
        name: this.name,
        context: this.context,
    };
  }
}
