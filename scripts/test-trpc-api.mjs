import dotenv from 'dotenv';

dotenv.config();

async function testAPI() {
  const apiUrl = 'http://localhost:3000/trpc/projects.getById';
  const projectId = 1; // The Pajama Game ID

  try {
    const response = await fetch(`${apiUrl}?input={"id":${projectId}}`);
    const data = await response.json();
    
    console.log('🔍 API Response for project ID 1:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.result?.data?.creativeTeam) {
      console.log('\n✅ creativeTeam found in response!');
      console.log('Members:', data.result.data.creativeTeam);
    } else {
      console.log('\n❌ creativeTeam NOT found in response');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
