export async function handler(event: any) {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {result: 'OK - Typescript'};
}
