class APIUtils {

    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken() {
        const loginResponse = await this.apiContext.post(
            'https://rahulshettyacademy.com/api/ecom/auth/login',
            { data: this.loginPayload }
        );
        if (!loginResponse.ok()) {
            throw new Error("Login via API falhou: status " + loginResponse.status());
        }
        const loginResponseJson = await loginResponse.json();
        return loginResponseJson.token;
    }

    async createOrder(orderPayload) {
        const response = {};
        response.token = await this.getToken();

        const orderResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayload,
                headers: {
                    "authorization": response.token,
                    "Content-Type": "application/json"
                }
            }
        );
        const orderResponseJson = await orderResponse.json();
        response.orderId = orderResponseJson.orders[0];
        return response;
    }
}

module.exports = { APIUtils };