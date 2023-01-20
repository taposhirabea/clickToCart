'use strict';
const stripe = require('stripe') ('');
/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product');


// module.exports = {
// 	create: async ctx => {
// 	const {name,total, items, stripeTokenId}=ctx.request.body
// 	const {id} = ctx.state.user

// 	const charge = await stripe.charges.create({
// 	amount: Math.round(total*100),
// 	currency:"usd",
// 	source:stripeTokenId,
// 	description: `Order ${new Date()} by ${ctx.state.user.username}`
// }) 
// const order = await strapi.services.order.create({
// name, total, items, user:id
// })
// return order;
// }
// }