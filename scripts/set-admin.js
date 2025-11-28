// Use o "Error-first callback" para require, se necessário, ou adote import/export.
const admin = require('firebase-admin');

// --- INSTRUÇÕES ---
// 1. Substitua o caminho abaixo pelo caminho para o seu arquivo de chave de conta de serviço.
//    Você pode baixar este arquivo no Console do Firebase > Configurações do Projeto > Contas de Serviço.
const serviceAccount = require('../serviceAccountKey.json');

// 2. Pegue o email do usuário a partir dos argumentos da linha de comando.
const email = process.argv[2];

if (!email) {
  console.error('ERRO: Por favor, forneça o email do usuário como um argumento.');
  console.error('Uso: npm run set-admin -- seu-email@exemplo.com');
  process.exit(1);
}

// Inicialize o Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    if (error.code === 'app/duplicate-app') {
        console.log("App já inicializado, continuando...");
    } else {
        console.error("Erro ao inicializar o Firebase Admin:", error);
        process.exit(1);
    }
}


// Função principal para definir o custom claim
async function setAdminClaim(email) {
  try {
    // 1. Encontre a conta de usuário pelo email.
    const user = await admin.auth().getUserByEmail(email);

    // 2. Verifique se o usuário já é admin.
    if (user.customClaims && user.customClaims.admin === true) {
      console.log(`Sucesso: O usuário ${email} já é um administrador.`);
      return;
    }

    // 3. Se não for, defina o custom claim.
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Sucesso! O usuário ${email} agora é um administrador.`);
    console.log('NOTA: As alterações podem levar alguns minutos para serem propagadas.');
    
  } catch (error) {
    console.error('Ocorreu um erro:', error.message);
  } finally {
    // Encerra a aplicação para garantir que o processo termine.
    process.exit(0);
  }
}

// Execute a função
setAdminClaim(email);
