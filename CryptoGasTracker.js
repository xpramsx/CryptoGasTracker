// Project: CryptoGasTracker
// Language: JavaScript, Python, Java
// Description: Multi-language Gas Fee Tracker for Ethereum & BSC

// Folder Structure:
// - js/ (Node.js version)
// - python/ (Python version)
// - java/ (Java version)

// ========== JavaScript Version ==========
// crypto_gas_tracker/js/index.js
import axios from 'axios';
import { program } from 'commander';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEYS = {
    ethereum: process.env.ETHERSCAN_API_KEY,
    bsc: process.env.BSCSCAN_API_KEY,
};

const API_URLS = {
    ethereum: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${API_KEYS.ethereum}`,
    bsc: `https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=${API_KEYS.bsc}`
};

const getGasFee = async (network) => {
    try {
        const response = await axios.get(API_URLS[network]);
        if (response.data.status === "1") {
            return response.data.result;
        } else {
            throw new Error("Invalid API response");
        }
    } catch (error) {
        console.error(`Error fetching gas fee for ${network}:`, error.message);
    }
};

// CLI Command
program.version('1.0.0')
    .description('Crypto Gas Fee Tracker')
    .option('-n, --network <network>', 'Specify network (ethereum/bsc)', 'ethereum')
    .action(async (cmd) => {
        const gasFee = await getGasFee(cmd.network);
        if (gasFee) {
            console.log(`Gas Fees for ${cmd.network.toUpperCase()}:
            - Low: ${gasFee.SafeGasPrice} Gwei
            - Average: ${gasFee.ProposeGasPrice} Gwei
            - High: ${gasFee.FastGasPrice} Gwei`);
        }
    });

program.parse(process.argv);

// API Endpoint
app.get('/gas/:network', async (req, res) => {
    const network = req.params.network;
    if (!API_KEYS[network]) {
        return res.status(400).json({ error: 'Unsupported network' });
    }
    const gasFee = await getGasFee(network);
    if (gasFee) {
        res.json({ network, gasFee });
    } else {
        res.status(500).json({ error: 'Failed to fetch gas fee' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// ========== Python Version ==========
# crypto_gas_tracker/python/gas_tracker.py
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEYS = {
    "ethereum": os.getenv("ETHERSCAN_API_KEY"),
    "bsc": os.getenv("BSCSCAN_API_KEY"),
}

API_URLS = {
    "ethereum": f"https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey={API_KEYS['ethereum']}",
    "bsc": f"https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey={API_KEYS['bsc']}"
}

def get_gas_fee(network):
    try:
        response = requests.get(API_URLS[network])
        data = response.json()
        if data["status"] == "1":
            return data["result"]
        else:
            raise Exception("Invalid API response")
    except Exception as e:
        print(f"Error fetching gas fee for {network}: {e}")

# ========== Java Version ==========
// crypto_gas_tracker/java/GasTracker.java
import java.io.*;
import java.net.*;
import org.json.JSONObject;

public class GasTracker {
    static String ETHERSCAN_API_KEY = "your_etherscan_api_key";
    static String BSCSCAN_API_KEY = "your_bscscan_api_key";
    static String ETH_API_URL = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" + ETHERSCAN_API_KEY;
    static String BSC_API_URL = "https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=" + BSCSCAN_API_KEY;

    public static JSONObject getGasFee(String network) throws Exception {
        String urlString = network.equals("ethereum") ? ETH_API_URL : BSC_API_URL;
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String inputLine;
        StringBuffer content = new StringBuffer();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }
        in.close();
        conn.disconnect();

        return new JSONObject(content.toString()).getJSONObject("result");
    }
}
