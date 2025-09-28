const BASE_URL = "http://59.110.161.193:8080/api/v1";

async function fetchNfts() {
  try {
    const response = await fetch(`${BASE_URL}/nft`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    console.log("Successfully fetched NFTs from API:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error fetching NFTs from API:", error);
    process.exitCode = 1;
  }
}

fetchNfts();
