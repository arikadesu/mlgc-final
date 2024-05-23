const { Firestore } = require('@google-cloud/firestore');

async function getHistories() {
  const db = new Firestore();
  const snapshot = await db.collection('predictions').get();
  const histories = [];
  snapshot.forEach(doc => {
    histories.push({ id: doc.id, history: doc.data() });
  });
  return histories;
}

module.exports = getHistories;
