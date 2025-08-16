                <button
                  onClick={() => window.location.href = '/ref-escrow/frontend/index.html'}
                  disabled={!investmentAmount || parseFloat(investmentAmount) < 50}
                  className="w-full py-3 bg-secondary hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-xl font-semibold text-white transition-all duration-300 btn-animate ripple"
                >
                  Invest Now
                </button> 