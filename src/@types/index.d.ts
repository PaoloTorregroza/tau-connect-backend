interface responseDefinition {
    status: number;
    data: {
        token?: string;
        msg?: string;
        data?;
    }
}