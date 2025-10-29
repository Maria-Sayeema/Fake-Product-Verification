let web3;
let contract;
let accounts;
const contractAddress = "0x6F66f939a24286d297462b5dddBCee11864B6b11"; // replace with your actual contract address
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_manufacturer",
				"type": "string"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			}
		],
		"name": "isFake",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "manufacturer",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isGenuine",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			}
		],
		"name": "verifyProduct",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

window.addEventListener('load', async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else {
    alert("Please install MetaMask!");
    return;
  }

  document.getElementById("connectWallet").onclick = async () => {
    try {
      accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      document.getElementById("walletAddress").innerText = `Connected: ${accounts[0]}`;
      contract = new web3.eth.Contract(abi, contractAddress);

      const owner = await contract.methods.owner().call();
      if (accounts[0].toLowerCase() === owner.toLowerCase()) {
        document.getElementById("addProductBtn").disabled = false;
        showFeedback("Connected as contract owner", "green");
      } else {
        showFeedback("Connected (Not owner — cannot add products)", "orange");
      }
    } catch (err) {
      showFeedback("Error connecting wallet", "red");
    }
  };

  document.getElementById("addProductBtn").onclick = async () => {
    const id = document.getElementById("addId").value;
    const name = document.getElementById("addName").value;
    const manufacturer = document.getElementById("addManufacturer").value;

    showFeedback("Adding product...", "blue");
    try {
      await contract.methods.addProduct(id, name, manufacturer).send({ from: accounts[0] });
      showFeedback("✅ Product added successfully!", "green");
    } catch (err) {
      showFeedback("❌ Error adding product: " + err.message, "red");
    }
  };

  document.getElementById("verifyBtn").onclick = async () => {
    const id = document.getElementById("verifyId").value;
    showFeedback("Verifying product...", "blue");
    try {
      const result = await contract.methods.verifyProduct(id).call();
      document.getElementById("verifyResult").innerText =
        `Name: ${result[0]}, Manufacturer: ${result[1]}, Genuine: ${result[2]}`;
      showFeedback("✅ Product verified", "green");
    } catch (err) {
      showFeedback("❌ Error verifying: " + err.message, "red");
    }
  };

  document.getElementById("fakeCheckBtn").onclick = async () => {
    const id = document.getElementById("fakeId").value;
    showFeedback("Checking fake status...", "blue");
    try {
      const isFake = await contract.methods.isFake(id).call();
      document.getElementById("fakeResult").innerText = isFake ? "❌ FAKE Product" : "✅ Genuine Product";
      showFeedback("✅ Checked fake status", "green");
    } catch (err) {
      showFeedback("❌ Error checking: " + err.message, "red");
    }
  };
});

function showFeedback(msg, color) {
  const feedback = document.getElementById("feedback");
  feedback.innerText = msg;
  feedback.style.color = color || "black";
}
