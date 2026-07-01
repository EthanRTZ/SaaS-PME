export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6">PME Assistant</h1>
          <p className="text-xl mb-8 text-blue-100">
            Centralisez et automatisez votre gestion administrative grâce à l&apos;IA
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white bg-opacity-10 backdrop-blur p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">🤖 Chat IA</h2>
              <p className="text-blue-100">Assistez-vous dans vos tâches professionnelles avec une IA intégrée</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">📄 Documents</h2>
              <p className="text-blue-100">Analysez, résumez et interrogez vos documents en un clic</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">📧 Emails</h2>
              <p className="text-blue-100">Générez automatiquement des emails professionnels</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">💰 Facturation</h2>
              <p className="text-blue-100">Créez devis et factures avec export PDF</p>
            </div>
          </div>

          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
              Commencer
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition">
              En savoir plus
            </button>
          </div>

          <div className="mt-20 text-blue-100">
            <p className="text-sm">Application en construction - Prochainement disponible</p>
          </div>
        </div>
      </div>
    </main>
  )
}
