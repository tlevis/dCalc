<template>
    <v-row justify="center" align="center">
        <v-dialog v-model="processing" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text style="padding: 20px">
                    Processing, please wait...

                    <v-progress-linear
                        style="margin-top: 5px"
                        indeterminate
                        color="white"
                        class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="unsupportedNetwork" width="500" persistent>
            <v-card>
                <v-card-title class="text-h5 error lighten-2"> Error </v-card-title>

                <v-card-text>
                    You are using unsupported network ({{ cahinName }}).<br />
                    Please connect your wallet to Rinkeby and refresh the page.
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-col cols="12" sm="8" md="6">
            <v-card>
                <v-card-title class="headline" style="justify-content: center">
                    <AppLogo :badge="!isRegistered" />
                </v-card-title>
                <v-card-text class="calc-wallet-section-container">
                    <div id="row">
                        <b>Wallet:</b>
                        <div v-if="accounts != null" class="short-wallet-address">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">{{ accounts[0] }}</span>
                                </template>
                                <span>{{ cahinName }}: {{ accounts[0] }}</span>
                            </v-tooltip>
                        </div>
                        <v-btn
                            v-if="accounts == null"
                            style="margin-left: 10px"
                            x-small
                            color="primary"
                            @click="connect"
                            >Connect your wallet</v-btn
                        >
                    </div>
                    <div v-if="!isRegistered" style="margin-top: 10px">
                        <v-btn style="margin-left: 10px" x-small color="green" @click="register"
                            >Subscribe Now! Only 0.001 ETH!!!</v-btn
                        >
                    </div>
                    <div v-if="isRefundable" style="margin-top: 10px">
                        <v-btn style="margin-left: 10px" x-small color="green" @click="refund">Request Refund</v-btn>
                    </div>
                </v-card-text>
                <v-card-text class="calc-main-section">
                    <div class="calc-display">
                        <div id="numbers" class="calc-display-text">
                            {{ displayText }}
                        </div>
                        <div class="blink calc-display-text">_</div>
                        <div v-if="displayError != ''" class="calc-display-error-text">
                            <b>Error:</b> {{ this.displayError }}
                        </div>
                    </div>
                    <div class="calc-grid-container">
                        <div class="calc-button-grid">
                            <v-btn
                                :class="buttonStyle(btn)"
                                v-for="(btn, index) in buttons"
                                v-bind:key="'button_' + index"
                                @click="buttonPress(btn)"
                                >{{ btn }}</v-btn
                            >
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import { ethers } from 'ethers';
import { mapGetters } from 'vuex';

export default {
    name: 'IndexPage',
    data() {
        return {
            accounts: null,

            contract: null,
            provider: null,
            signer: null,
            cahinName: 'not connected',
            unsupportedNetwork: false,

            displayText: '',
            displayError: '',

            processing: false,

            isRegistered: false,
            regDate: 0,
        };
    },
    mounted() {
        var self = this;
        // Make sure that the UI is loaded and try to connect to MetaMask
        this.$nextTick(() => {
            self.connect();
        });
    },
    computed: {
        ...mapGetters({
            contractAddress: 'getContractAddress',
            contractABI: 'getABI',
            buttons: 'getButtons',
        }),

        isRefundable() {
            // Check if the user registerd within 30 days to show him the refund button
            if (this.isRegistered) {
                return Date.now() / 1000 - this.regDate < 2592000;
            }
            return false;
        },
    },
    methods: {
        async connect() {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.accounts = await this.provider.send('eth_requestAccounts', []);
            this.signer = this.provider.getSigner();
            this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.signer);
            const { name } = await this.provider.getNetwork();
            this.cahinName = name;

            if (this.cahinName.toLowerCase() != 'rinkeby') {
                this.unsupportedNetwork = true;
            }

            await this.checkIfUserRegistered();
        },

        async register() {
            try {
                this.processing = true;
                var result = await this.contract.register({
                    value: ethers.utils.parseEther('0.001').toString(),
                });
                var rc = await result.wait(); // Do something with the receipt
                this.checkIfUserRegistered();
            } catch (err) {
                this.displayError = err.reason;
            }
            this.processing = false;
        },

        async refund() {
            var self = this;
            this.processing = true;
            try {
                var result = await this.contract.refund();
                var rc = await result.wait(); // Do something with the receipt
                self.regDate = 0;
                self.isRegistered = false;
                self.processing = false;
            } catch (err) {
                self.displayError = err.reason;
                self.processing = false;
            }
        },

        buttonStyle(value) {
            var style = 'calc-button ';
            if (value == '=') {
                style += 'extended-button';
            }
            return style;
        },

        isValidEQ(eq) {
            if (eq == '') {
                this.displayError = 'Expression is empty';
                return false;
            }

            var parts = eq.match(/[^\d()]+|[\d.]+/g);
            if (parts == null) {
                this.displayError = 'Expression is empty';
                return false;
            } else {
                if (parts.length > 2) {
                    if (parts.length % 2 == 0) {
                        this.displayError = 'Invalid Expression 2';
                        return false;
                    } else if (isNaN(parts[0])) {
                        this.displayError = 'Invalid Expression 3';
                        return false;
                    }
                } else {
                    this.displayError = 'Invalid Expression 1';
                    return false;
                }
            }

            return true;
        },

        async buttonPress(value) {
            this.displayError = '';
            if (value == '=') {
                if (this.displayText == 'undefined' || this.displayText == undefined || this.displayText == null) {
                    this.displayText = '';
                }

                var eq = this.displayText.replaceAll('x', '*').replaceAll('÷', '/');

                if (this.isValidEQ(eq)) {
                    this.processing = true;
                    var r = await this.solve(eq);
                    this.displayText = r;
                    this.processing = false;
                }
            } else if (value == 'C') {
                this.displayText = '';
            } else if (value == '⌫') {
                this.displayText = this.displayText.slice(0, -1);
            } else {
                this.displayText += value.toString();
            }
        },

        async checkIfUserRegistered() {
            var self = this;
            this.processing = true;
            this.contract.checkUser().then(
                (result) => {
                    self.regDate = result.toNumber();
                    self.isRegistered = self.regDate > 0;
                    self.processing = false;
                },
                (err) => {
                    self.isRegistered = false;
                    self.regDate = 0;
                    self.processing = false;
                }
            );
        },

        async solve(str) {
            var expressionIndex = Math.max(str.lastIndexOf('-'), str.lastIndexOf('+'));

            if (expressionIndex === -1) {
                expressionIndex = Math.max(str.lastIndexOf('*'), str.lastIndexOf('/'));
            }
            if (expressionIndex === -1) {
                var num = Number.parseInt(str.trim());
                if (isNaN(num)) {
                    this.displayError = 'not a valid number';
                } else {
                    return num;
                }
            } else {
                var leftVal = await this.solve(str.substring(0, expressionIndex).trim());
                var rightVal = await this.solve(str.substring(expressionIndex + 1).trim());
                try {
                    switch (str[expressionIndex]) {
                        case '+':
                            return (await this.contract.add(leftVal, rightVal)).toNumber();
                        case '-':
                            return (await this.contract.sub(leftVal, rightVal)).toNumber();
                        case '*':
                            return (await this.contract.mul(leftVal, rightVal)).toNumber();
                        case '/':
                            return (await this.contract.div(leftVal, rightVal)).toNumber();
                    }
                } catch (err) {
                    this.displayError = err.reason;
                }
            }
        },
    },
};
</script>
