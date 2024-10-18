import { Model, ModelClass, Transaction } from 'objection';

export async function myTransaction<T extends Model>(
  modelClass: ModelClass<T>,
  callback: (trx: Transaction) => Promise<T>,
): Promise<T> {
  const trx = await modelClass.startTransaction();
  try {
    const result = await callback(trx);
    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    console.log(error);
    throw error;
  }
}
