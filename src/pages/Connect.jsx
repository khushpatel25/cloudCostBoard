import React,{useState} from 'react';
import { useForm } from 'react-hook-form';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Connect = () => {

    const apiGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL || "https://3q04lem3jd.execute-api.us-east-1.amazonaws.com/cloudCostBoard"

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [inProcess, setInProcess] = useState(false);

    const onSubmit = async (data) => {
        const secretKey = import.meta.env.VITE_SECRET_KEY; 
        console.log({secretKey})
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        setInProcess(true)
        try {
            const res = await axios.post(apiGatewayUrl+"/storeSecret", { encryptedData });
            console.log(res.data)
            if (res.data.statusCode === 200) {
                    localStorage.setItem("cloudUsername",data.username)
                    toast.success("Connected Successfully.")
                    navigate('/')
            } else {
                toast.error("Oops! Something went wrong! Please try again.")
            }
        } catch (error) {
            console.error('Error sending data:', error);
            alert('Error sending data');
        } finally {
            setInProcess(false)
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-6 py-12">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Connect to cloudCostBoard</h1>
                <p className="text-muted-foreground">Enter your credentials to connect your account.</p>
            </div>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 mt-3">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Enter your username"
                                {...register("username", { required: true })}
                            />
                            {errors.username && <span className="text-red-600">This field is required</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="access-key">Access Key ID</Label>
                            <Input
                                type="password"
                                id="access-key"
                                placeholder="Enter your Access Key ID"
                                {...register("accessKeyId", { required: true })}
                            />
                            {errors.accessKeyId && <span className="text-red-600">This field is required</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="secret-key">Secret Access Key</Label>
                            <Input
                                type="password"
                                id="secret-key"
                                placeholder="Enter your Secret Access Key"
                                {...register("secretAccessKey", { required: true })}
                            />
                            {errors.secretAccessKey && <span className="text-red-600">This field is required</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="access-token">Session Token</Label>
                            <Input
                                type="password"
                                id="access-token"
                                placeholder="Enter your Session Token"
                                {...register("sessionToken", {required:true})}
                            />
                            {errors.sessionToken && <span className='text-red-600'>This field is required</span>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit" disabled={inProcess}>{ inProcess ? "Connecting..." : "Connect"}</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default Connect;
