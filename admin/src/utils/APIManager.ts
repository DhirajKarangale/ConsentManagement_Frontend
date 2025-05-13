import axios from 'axios';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export const getRequest = async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
        const response = await axios.get<T>(url);

        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        const errorMessage = error.response?.data || error.message || 'Unknown error';

        return {
            success: false,
            error: errorMessage,
        };
    }
};

export const postRequest = async <T>(url: string, body: Record<string, any>): Promise<ApiResponse<T>> => {
    try {
        const response = await axios.post<T>(url, body);

        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        const errorMessage = error.response?.data || error.message || 'Unknown error';

        return {
            success: false,
            error: errorMessage,
        };
    }
};

export const putRequest = async <T>(url: string, body: Record<string, any>): Promise<ApiResponse<T>> => {
    try {
        const response = await axios.put<T>(url, body);

        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        const errorMessage = error.response?.data || error.message || 'Unknown error';

        return {
            success: false,
            error: errorMessage,
        };
    }
};